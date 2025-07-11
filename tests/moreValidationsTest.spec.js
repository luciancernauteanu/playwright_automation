const {test, expect} = require ('@playwright/test');

test('Popup validations', async ({page}) => {

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();

    page.on('dialog', dialog => {dialog.accept();
        // dialog.dismiss();
    })
    await page.locator("#confirmbtn").click();
    
    await page.locator('#mousehover').hover();
    await page.locator('a[href="#top"]').click();
})

test('iFrame handling', async ({page}) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    const framePage = page.frameLocator('#courses-iframe');
    await framePage.locator('a[href*="lifetime-access"]:visible').click();

    const text = await framePage.locator('.text h2').textContent();

    const extractedText = text.split(" ")[1];
    console.log(extractedText);
    expect(text).toMatch("13,522");
})