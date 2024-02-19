"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const config_1 = require("@nestjs/config");
exports.typeOrmConfig = {
    useFactory: (configService) => ({
        type: 'mysql',
        host: configService.get('DB_HOSTNAME'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/../entity/*.entity{.ts,.js}'],
        timezone: 'Asia/Seoul',
        synchronize: true,
        logging: true,
    }),
    inject: [config_1.ConfigService],
};
//# sourceMappingURL=type-orm.config.js.map