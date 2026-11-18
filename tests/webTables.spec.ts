import { test, expect } from '@playwright/test';
import { WebTablesPage } from '../pages/WebTablesPage';
import { readCsv } from '../data/csvReader';

const users = readCsv('users.csv');

test('Soal 1 - Bulk insert user dari CSV ke Web Tables', async ({ page }) => {
  const webTables = new WebTablesPage(page);
  await webTables.goto();

  for (const user of users) {
    await webTables.addUser(user);
  }

  for (const user of users) {
    const row = webTables.getRowByEmail(user.email);
    await expect(row).toBeVisible();
    await expect(row).toContainText(user.firstName);
    await expect(row).toContainText(user.lastName);
    await expect(row).toContainText(user.age);
    await expect(row).toContainText(user.salary);
    await expect(row).toContainText(user.department);
  }
});
