import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MonitorService } from './monitor/monitor.service';
import { PptrService } from './pptr/pptr.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly monitorService: MonitorService,
    private readonly pptr: PptrService,
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

  @Get('/run-pptr')
  async getPptr() {
    const page = await this.pptr.browser?.newPage();
    if (!page) {
      return 'instance not created';
    }
    // Navigate the page to a URL
    await page.goto('https://developer.chrome.com/');

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

    // Type into search box
    await page.type('.devsite-search-field', 'automate beyond recorder');

    // Wait and click on first result
    const searchResultSelector = '.devsite-result-item-link';
    await page.waitForSelector(searchResultSelector);
    await page.click(searchResultSelector);

    // Locate the full title with a unique string
    const textSelector = await page.waitForSelector(
      'text/Customize and automate',
    );
    const fullTitle = await textSelector?.evaluate((el) => el.textContent);

    // Print the full title
    console.log('The title of this blog post is "%s".', fullTitle);
  }
}
