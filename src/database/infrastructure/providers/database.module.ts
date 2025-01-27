import { Module } from '@nestjs/common';
import { databaseProviders } from './typeorm.provider';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
