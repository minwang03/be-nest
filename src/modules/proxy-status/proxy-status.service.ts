import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Location,
  LocationDocument,
} from '@/modules/location/schemas/location.schema';
import { User, UserDocument } from '@/modules/users/schemas/user.schema';
import { Order, OrderDocument } from '@/modules/order/schemas/order.schema';

@Injectable()
export class ProxyStatusService {
  constructor(
    @InjectModel(Location.name)
    private readonly locationModel: Model<LocationDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async getProxyStatus(serviceSlug?: string): Promise<Record<string, any[]>> {
    const pipeline: any[] = [
      {
        $lookup: {
          from: 'packageproxies',
          let: { locId: '$_id' },
          pipeline: [
            {
              $lookup: {
                from: 'serviceproxies',
                localField: 'serviceProxy',
                foreignField: '_id',
                as: 'serviceProxy',
              },
            },
            { $unwind: '$serviceProxy' },
            ...(serviceSlug
              ? [{ $match: { 'serviceProxy.slug': serviceSlug } }]
              : []),
            {
              $lookup: {
                from: 'ipproxies',
                let: { pkgId: '$_id', locId: '$$locId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$packageProxy', '$$pkgId'] },
                          { $eq: ['$location', '$$locId'] },
                          { $eq: ['$isActive', false] },
                        ],
                      },
                    },
                  },
                ],
                as: 'inactiveIps',
              },
            },
            {
              $project: {
                name: 1,
                serviceSlug: '$serviceProxy.slug',
                type: {
                  $cond: [
                    {
                      $regexMatch: {
                        input: '$serviceProxy.slug',
                        regex: /^4g/i,
                      },
                    },
                    '4g',
                    'dancu',
                  ],
                },
                inactiveCount: { $size: '$inactiveIps' },
              },
            },
          ],
          as: 'packages',
        },
      },

      { $unwind: { path: '$packages', preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 0,
          location: '$name',
          package: '$packages.name',
          service: '$packages.serviceSlug',
          type: '$packages.type',
          inactiveCount: { $ifNull: ['$packages.inactiveCount', 0] },
        },
      },

      {
        $group: {
          _id: { type: '$type', location: '$location' },
          packages: {
            $push: {
              package: '$package',
              service: '$service',
              inactiveCount: '$inactiveCount',
            },
          },
        },
      },

      {
        $group: {
          _id: '$_id.type',
          locations: {
            $push: {
              location: '$_id.location',
              packages: '$packages',
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          type: '$_id',
          locations: 1,
        },
      },

      { $sort: { type: 1 } },
    ];

    const aggResult = await this.locationModel.aggregate(pipeline);

    const result: Record<string, any[]> = {};
    for (const g of aggResult) {
      result[g.type || 'dancu'] = g.locations || [];
    }

    if (!result['4g']) result['4g'] = [];
    if (!result['dancu']) result['dancu'] = [];

    return result;
  }

  async getDashboardSummary() {
    const totalUsers = await this.userModel.countDocuments({});
    const totalOrders = await this.orderModel.countDocuments({});
    const paidOrders = await this.orderModel.countDocuments({
      status: 'paid',
    });
    const pendingOrders = await this.orderModel.countDocuments({
      status: 'pending',
    });

    return {
      totalUsers,
      totalOrders,
      paidOrders,
      pendingOrders,
    };
  }

  async getRecentOrders() {
    const orders = (await this.orderModel
      .find({})
      .sort({ createdAt: -1 })
      .populate('user', 'username email')
      .populate({
        path: 'packageProxy',
        select: 'name expiry cost serviceProxy',
        populate: { path: 'serviceProxy', select: 'name type' },
      })
      .lean()) as any[];

    return orders.map((order) => ({
      id: order._id,
      user: order.user?.username || 'Unknown',
      email: order.user?.email || '',
      package: order.packageProxy?.name || 'N/A',
      service:
        order.packageProxy?.serviceProxy?.name ||
        order.packageProxy?.serviceProxy ||
        'Unknown',
      status: order.status,
      total: order.sumcost || 0,
      quantity: order.quantity || 0,
      createdAt: order.createdAt,
    }));
  }

  async getProxyLocations() {
    const pipeline = [
      {
        $lookup: {
          from: 'ipproxies',
          localField: '_id',
          foreignField: 'location',
          as: 'proxies',
        },
      },
      {
        $project: {
          name: 1,
          activeCount: {
            $size: {
              $filter: {
                input: '$proxies',
                as: 'proxy',
                cond: { $eq: ['$$proxy.isActive', true] },
              },
            },
          },
          inactiveCount: {
            $size: {
              $filter: {
                input: '$proxies',
                as: 'proxy',
                cond: { $eq: ['$$proxy.isActive', false] },
              },
            },
          },
        },
      },
      { $sort: { activeCount: -1 as -1 } },
    ];

    const locations = await this.locationModel.aggregate(pipeline);

    const totalActive = locations.reduce((acc, l) => acc + l.activeCount, 0);

    const result = locations.map((l) => ({
      name: l.name,
      active: l.activeCount,
      inactive: l.inactiveCount,
      percentage: totalActive
        ? Math.round((l.activeCount / totalActive) * 100)
        : 0,
    }));

    return result;
  }
}
