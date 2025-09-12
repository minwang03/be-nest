import { Module } from '@nestjs/common';
import { LocationService } from '@/modules/location/location.service';
import { LocationController } from '@/modules/location/location.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Location,
  LocationSchema,
} from '@/modules/location/schemas/location.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
  ],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
