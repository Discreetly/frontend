import type { Page } from '@playwright/test';

export async function getLocalStorage(page: Page) {
	const state = await page.context().storageState();
	return state.origins[0].localStorage;
}
