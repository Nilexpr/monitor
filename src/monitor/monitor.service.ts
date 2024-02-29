import { Injectable } from '@nestjs/common';
import { fork } from 'child_process';

@Injectable()
export class MonitorService {
  public monitor = fork('./src/monitor/monitor.ts', {
    execArgv: ['--require=ts-node/register'],
  });

  constructor() {
    console.log(`Monitor start with ${this.monitor.pid}`);

    this.monitor.on('data', (msg) => {
      console.log('message from parent', msg);
    });

    this.monitor.on('exit', (code) => {
      console.log(`Monitor exited code ${code}`);
    });
  }
}
