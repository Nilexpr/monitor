import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CgroupsService } from './cgroups/cgroups.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, CgroupsService],
})
export class AppModule {}
