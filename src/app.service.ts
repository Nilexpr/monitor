import { Injectable } from '@nestjs/common';
import { CgroupsService } from './cgroups/cgroups.service';

@Injectable()
export class AppService {
  constructor(private cgroupsService: CgroupsService) {}
  getHello(): string {
    return 'Hello!';
  }

  getBlock() {
    const targetTime = Date.now() + 5000;
    while (targetTime > Date.now()) {}
    return 'Block!';
  }

  runChild() {
    this.cgroupsService.run();
  }
}
