const {test, expect} = require ('@playwright/test');
const path = require('path');

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

test.only('Capture screenshot and visual comparison', async({page})=>{

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#displayed-text").screenshot({path: 'locator_screenshot.png'});  //locator of screenshot
    
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden(); 
    await page.screenshot({path: 'screenshot.png'}) //screenshot of all page
})

test ('visual comparing screenshots', async({page})=>{

    // await page.goto('https://www.cheapflights.com/');
    await page.goto('https://www.google.com/');
    expect(await page.screenshot()).toMatchSnapshot('landing.png')
})
//screenshot - stroreIt -> screenshot to compare with initial screenshot