import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get('DB_HOST', 'host.docker.internal'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'myuser'),
        password: configService.get('DB_PASSWORD', 'mypassword'),
        database: configService.get('DB_NAME', 'mydatabase'),
        entities: [__dirname + '/../../../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
