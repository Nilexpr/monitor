import { Injectable } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';

@Injectable()
export class PptrService {
  browser: Browser | null;

  constructor() {
    const init = async () => {
      this.browser = await puppeteer.launch({ headless: false });
    };
    init();
  }
}
