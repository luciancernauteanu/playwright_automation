const {test, expect} = require('@playwright/test');
const { OpenApplication } = require('../utils/E2E_eCommerce/OpenApplication');
const { userRegistration, getEmail, getPassword } = require('../utils/E2E_eCommerce/userRegistrationAction.js');

test('User is able to Register', async ({page}) => {

    await OpenApplication(page);
    await userRegistration(page) ;
    await expect(page.locator('h1[class="headcolor"]')).toContainText('Successfully');
    expect(page.locator('div[aria-label="Registered Successfully"]')).toBeEnabled();
})


test('User is able to Log In', async ({page}) => {
    await OpenApplication(page);
    const { email, password } = await userRegistration(page);

    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(password);
    await page.locator('input[type="submit"]').click();
})