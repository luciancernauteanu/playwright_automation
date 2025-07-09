const { expect } = require("@playwright/test");

async function OpenParabankApplication(page) {
    await page.goto('/');
    await expect(page).toHaveTitle("ParaBank | Welcome | Online Banking");
}

module.exports = {OpenParabankApplication}