import { HttpModule, Module } from '@nestjs/common';
import { PinataService } from './pinata.service';
import { Web3Service } from './web3.service';

@Module({
  imports: [HttpModule],
  providers: [Web3Service, PinataService],
  exports: [Web3Service, PinataService],
})
export class Web3Module {}
