import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '@/modules/users/users.module';
import { ServiceProxyModule } from '@/modules/service-proxy/service-proxy.module';
import { AuthModule } from '@/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/auth/passport/jwt-auth.guard';
import { ProxyListModule } from '@/modules/proxy-list/proxy-list.module';
import { LocationModule } from '@/modules/location/location.module';
import { PackageProxyModule } from '@/modules/package-proxy/package-proxy.module';
import { IpProxyModule } from '@/modules/ip-proxy/ip-proxy.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ServiceProxyModule,
    AuthModule,
    ProxyListModule,
    LocationModule,
    PackageProxyModule,
    IpProxyModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
