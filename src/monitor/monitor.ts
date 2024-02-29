import { exec } from 'child_process';
import pidusage = require('pidusage');
import { kill } from 'process';

interface IMessage {
  pid: number;
}

let globalPid: number;

process.on('message', ({ pid }: IMessage) => {
  console.log('pid from parent:', pid);
  globalPid = pid;
});

setInterval(() => {
  console.log(new Date().toLocaleTimeString());
  if (globalPid) {
    pidusage(globalPid, (err, stats) => {
      console.log(stats);
      const { cpu, memory } = stats ?? {};

      if (cpu > 60) {
        kill(globalPid);
      }
    });
  }
}, 1000);

export {};
