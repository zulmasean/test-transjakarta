import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async open(url: string) {
    await this.page.route(/googlesyndication|doubleclick|googletagservices|adplus/, (route) => route.abort());
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('load');
    await this.page.locator('#fixedban, footer').evaluateAll((els) => els.forEach((el) => el.remove()));
  }
}
