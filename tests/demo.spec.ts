import { test, expect } from '@playwright/test';
import { DroppablePage } from '../pages/DroppablePage';

test('First Playwright test', async ({browser})=>
{
    //chrome - plugins
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://google.com")

})

