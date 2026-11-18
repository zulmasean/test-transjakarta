import { test, expect } from '@playwright/test';
import { ResizablePage } from '../pages/ResizablePage';

test('Soal 3 - Resize elemen menjadi 400 x 200 piksel', async ({ page }) => {
  const resizable = new ResizablePage(page);
  await resizable.goto();

  await resizable.resizeTo(400, 200);

  await expect(resizable.box).toHaveCSS('width', '400px');
  await expect(resizable.box).toHaveCSS('height', '200px');
});
