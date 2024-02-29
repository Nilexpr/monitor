import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MonitorService } from './monitor/monitor.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly monitorService: MonitorService,
  ) {
    process.on('message', (m) => {
      console.log('CHILD got message:', m);
    });
  }

  @Get('/hello')
  getHello() {
    return this.appService.getHello();
  }

  @Get('/run-cpu')
  getBlock() {
    const { pid } = this.appService.runCPU();

    const monitor = this.monitorService.monitor;

    monitor.send({
      pid,
    });

    return pid;
  }
}
