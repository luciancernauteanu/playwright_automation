const {test, expect} = require('@playwright/test');
const {openLoginPagePractise, loginWithCredentials} = require('../utils/LoginPageHelper');
const { text } = require('stream/consumers');
const { console } = require('inspector');

test('Login Page Happy Flow', async ({page})=>{
    openLoginPagePractise(page);
    loginWithCredentials(page, "rahulshettyacademy", "learning");
    await page.locator('#terms').click();
    await page.locator('#signInBtn').click();
})

test('Login with incorrect username', async ({page})=>{
    openLoginPagePractise(page);
    loginWithCredentials(page, "rahulshettyacademy1", "learning");
    await page.locator('#terms').click();
    await page.locator('#signInBtn').click();
    await expect(page.locator("[style*=block]")).toContainText("Incorrect")
})

test('Login with incorrect password', async ({page})=>{
    openLoginPagePractise(page);
    loginWithCredentials(page, "rahulshettyacademy", "learning1");
    await page.locator('#terms').click();
    await expect (page.locator('#terms')).toBeChecked();
    await page.locator('#terms').uncheck()
    expect (await page.locator('#terms').isChecked).toBeFalsy;
    await page.locator('#signInBtn').click();
    await expect(page.locator("[style*=block]")).toContainText("Incorrect")
})

test('Log in with Terms and conditions checkbox ticked should be mandatory', async ({page})=>{
    openLoginPagePractise(page);
    loginWithCredentials(page, "rahulshettyacademy", "learning");
    await page.locator('#signInBtn').click();
    await expect(page.locator("[style*=block]")).toContainText("Please indicate that you have read and agree to the Terms and Conditions and Privacy Policy")
})

test('Login as a user will trigger a popup to be displayed', async ({page})=>{
    openLoginPagePractise(page);
    loginWithCredentials(page, "rahulshettyacademy", "learning");
    await page.locator('#terms').click();
    await page.locator('#usertype').nth(1).click();
    expect(page.locator('#usertype').nth(1)).toBeChecked();
    await expect(page.locator(".modal-body p")).toContainText("You will be limited");
    await page.locator('#cancelBtn').click();
    await page.locator('#usertype').first().click();
    expect(page.locator('#usertype').first()).toBeChecked();
    await page.locator('#usertype').nth(1).click();
    expect(page.locator(".modal-body p")).toContainText("You will be limited");
    await page.locator('#okayBtn').click();
    await page.locator('#signInBtn').click();   
})

test('Select options from dropdown', async ({page})=>{
    openLoginPagePractise(page);
    loginWithCredentials(page, "rahulshettyacademy", "learning");
    await page.locator('#terms').click();
    await page.selectOption('select.form-control', "teach") //selectOption('locator', 'optiontoselect')
    await page.selectOption('select.form-control', "consult")
    await page.selectOption('select.form-control', "stud")
    await page.locator('#signInBtn').click();   
})


test('Link text has blicking class and opens in new tab', async ({page})=>{

    const documentsLink =  page.locator('[href*="documents-request"]');
    
    openLoginPagePractise(page);
    loginWithCredentials(page, "rahulshettyacademy", "learning");
    await( expect (documentsLink).toHaveAttribute('class', 'blinkingText'));
    await( expect (documentsLink).toHaveClass('blinkingText'));
    
})

test('Child window handling test', async ({browser}) =>{

    const context = await browser.newContext();
    const page  = await context.newPage()
    openLoginPagePractise(page);

    const documentsLink =  page.locator('[href*="documents-request"]');
    const [newPage] = await Promise.all([  //[newPage] - const will be array]
        context.waitForEvent('page'),
        documentsLink.click()
    ])
    const text = await newPage.locator('.red').textContent();
    console.log(text);
    const arrayText = text.split("@");
    const domain = arrayText[1].split(" ")[0];

    console.log(domain);

    await page.locator('#username').fill(domain)
})

//npx playwright codegen 'URL' - to record flows