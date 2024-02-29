import { Injectable } from '@nestjs/common';
import { fork } from 'child_process';

@Injectable()
export class AppService {
  constructor() {}
  getHello(): string {
    console.log('Hello from Browser');
    return 'Hello!';
  }

  runCPU() {
    const child = fork('./src/monitor/block.ts');

    child.on('data', (data) => {
      console.log('stdout', data.toString());
    });

    child.on('exit', (code) => {
      console.log(`Task exited code ${code}`);
    });
    return child;
  }
}
