import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MonitorService } from './monitor/monitor.service';
import { PptrService } from './pptr/pptr.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, MonitorService, PptrService],
})
export class AppModule {}
