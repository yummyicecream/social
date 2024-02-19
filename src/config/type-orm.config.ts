import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get('DB_HOSTNAME'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [__dirname + '/../entity/*.entity{.ts,.js}'],
    timezone: 'Asia/Seoul',
    synchronize: true,
  }),
  inject: [ConfigService],
};
