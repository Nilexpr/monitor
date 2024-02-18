import { Injectable } from '@nestjs/common';
import { execSync, spawn } from 'child_process';

const child = spawn('systemd-run', [
  '--scope',
  '--slice=monitor',
  'node',
  './hello.ts',
]);
child.stdout.on('data', (data) => {
  console.log('stdout', data.toString());
});

const cgroupName = 'cgroupName';

@Injectable()
export class CgroupsService {
  //   private readonly childMap = new Map([
  //     [
  //       'a',
  //       spawn(
  //         'systemd-run',
  //         ['--scope', '--slice=monitor', 'node', './hello.ts'],
  //         {
  //           env: Object.assign({}, process.env),
  //         },
  //       ),
  //     ],
  //   ]);

  run() {
    // const child = this.childMap.get('a');
    execSync(`cgcreate -g cpuUsage,cpuset:${cgroupName}`);
    execSync(`cgset -r cpu.cfs_quota_us=$((${500000 * 100})) ${cgroupName}`);
    const child = spawn(
      `${cgroupName}`,
      ['--scope', '--slice=monitor', 'node', './block.ts'],
      {
        env: Object.assign({}, process.env, {
          LD_PRELOAD: '/usr/local/lib/my-custom-library.so',
        }),
      },
    );
    execSync(`echo ${child.pid} > /sys/fs/cgroup/cpu/${cgroupName}/tasks`);
    child.stdout.on('data', (data) => {
      console.log('stdout', data.toString());
    });
    child.stderr.on('data', (data) => {
      console.error(`stderror ${data}`);
    });
  }
}
