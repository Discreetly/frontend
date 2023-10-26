import { expect, test } from '@playwright/test';
import { getLocalStorage } from './utils';

test.describe('/', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('mount', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Welcome to Discreetly' })).toBeVisible();
	});

	test('default servers should be set', async ({ page }) => {
		const localStorage = await getLocalStorage(page);
		localStorage.forEach((object) => {
			switch (object.name) {
				case 'selectedServer':
					expect(object.value).toBe('"https://server.discreetly.chat/"');
					break;
				case 'serverData':
					expect(object.value).toBe(
						'{"https://server.discreetly.chat/":{"name":"Discreetly Server","url":"https://server.discreetly.chat/"}}'
					);
					break;
			}
		});
	});
});
