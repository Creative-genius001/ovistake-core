import { Module } from '@nestjs/common';
import { StakeService } from './stake.service';
import { StakeController } from './stake.controller';

@Module({
  providers: [StakeService],
  controllers: [StakeController],
})
export class StakeModule {}
