import { BasePage } from './BasePage';
import { WebTablesLocators as L } from '../locators/webTables.locators';

export class WebTablesPage extends BasePage {
  async goto() {
    await this.open('/webtables');
  }

  async addUser(user: Record<string, string>) {
    await this.page.click(L.addButton);
    await this.page.fill(L.firstName, user.firstName);
    await this.page.fill(L.lastName, user.lastName);
    await this.page.fill(L.email, user.email);
    await this.page.fill(L.age, user.age);
    await this.page.fill(L.salary, user.salary);
    await this.page.fill(L.department, user.department);
    await this.page.click(L.submitButton);
  }

  getRowByEmail(email: string) {
    return this.page.getByRole('row').filter({ hasText: email });
  }
}
