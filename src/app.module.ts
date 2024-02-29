import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MonitorService } from './monitor/monitor.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, MonitorService],
})
export class AppModule {}
