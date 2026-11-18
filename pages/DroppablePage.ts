import { BasePage } from './BasePage';
import { DroppableLocators as L } from '../locators/droppable.locators';

export class DroppablePage extends BasePage {
  dropBox = this.page.locator(L.dropBox);

  async goto() {
    await this.open('/droppable');
  }

  async dragToTarget() {
    await this.page.waitForSelector(`${L.dropBox}.ui-droppable`);
    await this.page.locator(L.dragBox).dragTo(this.dropBox);
  }
}
