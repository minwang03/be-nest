import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from '@/modules/location/schemas/location.schema';

// Kết quả sẽ là: { [type: string]: Array<{ location: string; packages: Array<{ package: string; service: string; inactiveCount: number }> }> }
@Injectable()
export class ProxyStatusService {
  constructor(
    @InjectModel(Location.name)
    private readonly locationModel: Model<LocationDocument>,
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
            // Nếu filter theo 1 slug cụ thể
            ...(serviceSlug ? [{ $match: { 'serviceProxy.slug': serviceSlug } }] : []),
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
                          { $eq: ['$isActive', false] }, // đếm inactive
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
                // phân loại đơn giản: nếu slug bắt đầu bằng "4g" => 4g, còn lại coi là dân cư
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

      // tách packages (vẫn preserve để có location với packages rỗng)
      { $unwind: { path: '$packages', preserveNullAndEmptyArrays: true } },

      // chuẩn hóa
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

      // nhóm theo type + location: gom packages vào mỗi location
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

      // nhóm theo type: gom các location vào mảng locations
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

      // đưa về dạng dễ dùng
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

    // chuyển mảng [{ type, locations }] thành object { type: locations }
    const result: Record<string, any[]> = {};
    for (const g of aggResult) {
      result[g.type || 'dancu'] = g.locations || [];
    }

    // đảm bảo luôn có 2 keys (nếu muốn)
    if (!result['4g']) result['4g'] = [];
    if (!result['dancu']) result['dancu'] = [];

    return result;
  }
}
