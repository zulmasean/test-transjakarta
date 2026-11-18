import path from 'path';
import { BasePage } from './BasePage';
import { PracticeFormLocators as L } from '../locators/practiceForm.locators';

export class PracticeFormPage extends BasePage {
  modalTitle = this.page.locator(L.modalTitle);

  async goto() {
    await this.open('/automation-practice-form');
  }

  async fillAndSubmit(s: Record<string, string>) {
    await this.page.fill(L.firstName, s.firstName);
    await this.page.fill(L.lastName, s.lastName);
    await this.page.fill(L.email, s.email);
    await this.page.getByText(s.gender, { exact: true }).click();
    await this.page.fill(L.mobile, s.mobile);

    await this.page.click(L.dateOfBirth);
    await this.page.keyboard.press('ControlOrMeta+A');
    await this.page.keyboard.type(s.dateOfBirth);
    await this.page.keyboard.press('Enter');

    await this.selectOption(L.subjects, s.subject);

    await this.page.getByText(s.hobby, { exact: true }).click();
    await this.page.setInputFiles(L.uploadPicture, path.join(__dirname, '../data', s.picture));
    await this.page.fill(L.address, s.address);

    await this.selectOption(L.state, s.state);
    await this.selectOption(L.city, s.city);

    await this.page.click(L.submitButton);
  }

  private async selectOption(input: string, value: string) {
    await this.page.fill(input, value);
    const option = this.page.locator(L.autocompleteOption).filter({ hasText: value }).first();
    await option.waitFor({ state: 'visible' });
    await option.click();
  }

  getModalValue(label: string) {
    return this.page.locator(L.modalRow).filter({ hasText: label }).locator('td').nth(1);
  }
}
