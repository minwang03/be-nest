import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from '@/modules/location/dto/create-location.dto';
import { UpdateLocationDto } from '@/modules/location/dto/update-location.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Location } from './schemas/location.schema';
import { Model } from 'mongoose';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    const { name, code } = createLocationDto;

    const location = await this.locationModel.create({
      name,
      code,
    });

    return {
      _id: location.id,
    };
  }

  async findAll() {
    return await this.locationModel.find().exec();
  }

  async findOne(id: string) {
    return await this.locationModel.findById(id).exec();
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    return await this.locationModel.updateOne(
      { _id: id },
      { $set: updateLocationDto },
    );
  }

  async remove(id: string) {
    return await this.locationModel.findByIdAndDelete(id).exec();
  }
}
