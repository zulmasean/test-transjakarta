import { BasePage } from './BasePage';
import { ResizableLocators as L } from '../locators/resizable.locators';

export class ResizablePage extends BasePage {
  box = this.page.locator(L.box);

  async goto() {
    await this.open('/resizable');
  }

  async resizeTo(width: number, height: number) {
    const handle = this.page.locator(L.handle);
    await this.box.scrollIntoViewIfNeeded();

    for (let attempt = 0; attempt < 3; attempt++) {
      const boxPos = await this.box.boundingBox();
      const handlePos = await handle.boundingBox();
      if (!boxPos || !handlePos) throw new Error('Kotak / handle resize tidak ditemukan');

      const x = handlePos.x + handlePos.width / 2;
      const y = handlePos.y + handlePos.height / 2;

      const dx = width - boxPos.width;
      const dy = height - boxPos.height;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;

      await this.page.mouse.move(x, y);
      await this.page.mouse.down();
      await this.page.mouse.move(x + dx, y + dy, { steps: 20 });
      await this.page.mouse.up();
    }
  }
}
