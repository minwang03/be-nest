import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from '@/modules/location/schemas/location.schema';

@Injectable()
export class ProxyStatusService {
  constructor(
    @InjectModel(Location.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {}

  async getProxyStatus(serviceSlug?: string) {
    const pipeline: any[] = [
      // Join sang PackageProxy
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
            // Nếu có filter serviceSlug
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
                service: '$serviceProxy.slug',
                inactiveCount: { $size: '$inactiveIps' },
              },
            },
          ],
          as: 'packages',
        },
      },

      // Nếu 1 location không có package nào → bỏ qua hoặc vẫn hiện 
      { $unwind: { path: '$packages', preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 0,
          location: '$name',
          package: '$packages.name',
          service: '$packages.service',
          inactiveCount: {
            $ifNull: ['$packages.inactiveCount', 0],
          },
        },
      },

      { $sort: { location: 1, package: 1 } },
    ];

    return this.locationModel.aggregate(pipeline);
  }
}
