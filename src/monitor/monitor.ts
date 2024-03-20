import { exec, execSync } from 'child_process';
import { readFileSync } from 'fs';
import pidusage = require('pidusage');
import { kill } from 'process';
import os from 'os';

interface IMessage {
  pid: number;
}

let globalPid: number;

process.on('message', ({ pid }: IMessage) => {
  console.log('pid from parent:', pid);
  globalPid = pid;
});

function getHzFromTimerList() {
  const timerList = readFileSync('/proc/timer_list', 'utf8');
  const match = timerList.match(/jiffies\:\s*(\d+)/);
  console.log({ timerList });
  if (match) {
    return parseInt(match[1]);
  } else {
    return 100; // 默认值为 100
  }
}

function getProcessStats(pid: number) {
  const stat = readFileSync(`/proc/${pid}/stat`, 'utf8');
  const status = readFileSync(`/proc/${pid}/status`, 'utf8');

  console.log({ stat });

  const statArr = stat.split(' ');
  const utime = parseInt(statArr[14]); // 进程在用户态运行的时间
  const stime = parseInt(statArr[15]); // 进程在内核态运行的时间
  const startTime = parseInt(statArr[21]); // 进程启动时间
  const uptime = process.uptime();
  console.log({ uptime, startTime });
  // const hz = getHzFromTimerList();
  const hz = 100;

  const total_time = utime + stime;
  const seconds = uptime - startTime / hz;
  const cpuUsage = 100 * (total_time / hz / seconds);

  console.log({
    utime,
    stime,
    total_time,
  });
  const statusArr = status.split('\n');
  const memoryArr = statusArr
    .find((line) => line.startsWith('VmRSS'))
    ?.split(/\s+/);
  const memoryUsage = parseInt(memoryArr?.[1] ?? '0');

  return { cpuUsage, memoryUsage };
}

setInterval(() => {
  console.log(new Date().toLocaleTimeString());
  if (globalPid) {
    console.log(globalPid);
    // 获取进程的 CPU 使用情况
    try {
      console.log('start');
      const { cpuUsage, memoryUsage } = getProcessStats(globalPid);
      console.log(
        `Proc: 进程 ${globalPid} 的 CPU 占用: ${cpuUsage.toFixed(2)}%`,
      );
      console.log(`Proc: 进程 ${globalPid} 的内存占用: ${memoryUsage} KB`);

      pidusage(globalPid, (err, stats) => {
        const { cpu, memory } = stats ?? {};
        console.log('---------------------------------');
        console.log(`PS: 进程 ${globalPid} 的 CPU 占用率: ${cpu}%`);
        console.log(`PS: 进程 ${globalPid} 的内存占用: ${memory}`);

        // if (cpu > 60) {
        //   kill(globalPid);
        // }
      });

      // const cpuUsageFromPs = parseFloat(
      //   execSync(`ps -p ${globalPid} -o %cpu --no-headers`).toString().trim(),
      // );

      // // 获取进程的内存使用情况
      // const memUsageFromPs = parseFloat(
      //   execSync(`ps -p ${globalPid} -o %mem --no-headers`).toString().trim(),
      // );
      // console.log('---------------------------------');
      // console.log(`PS: 进程 ${globalPid} 的 CPU 占用率: ${cpuUsageFromPs}%`);
      // console.log(`PS: 进程 ${globalPid} 的内存占用率: ${memUsageFromPs}%`);
    } catch (error) {
      console.log('进程已停止');
    }
  }
}, 1000);

export {};
