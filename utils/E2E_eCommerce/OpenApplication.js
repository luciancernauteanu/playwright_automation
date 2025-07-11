const { expect } = require("@playwright/test");

async function OpenApplication (page){
    await page.goto('https://rahulshettyacademy.com/client/');
    expect(await page.title()).toBe("Let's Shop");
    // expect(await page.url()).toBe("https://rahulshettyacademy.com/client/auth/login");
}

module.exports = { OpenApplication };