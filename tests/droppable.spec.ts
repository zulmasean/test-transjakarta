import { test, expect } from '@playwright/test';
import { DroppablePage } from '../pages/DroppablePage';

test('Soal 2 - Drag and drop elemen ke area target', async ({ page }) => {
  const droppable = new DroppablePage(page);
  await droppable.goto();

  await expect(droppable.dropBox).toHaveText('Drop Here');
  await droppable.dragToTarget();
  await expect(droppable.dropBox).toHaveText('Dropped!');
});
