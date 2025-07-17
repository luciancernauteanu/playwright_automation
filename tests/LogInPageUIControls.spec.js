const {test, expect} = require('@playwright/test');
const {openLoginPagePractise, loginWithCredentials} = require('../utils/LoginPageHelper');
const { console } = require('inspector');

test.describe.configure({mode: "parallel"}); //asign worker for each test
// test.describe.configure({mode: "serial"}); //used for interdependent test -> if a test is depending of previous failing test it will be skipped 

test('@Web Login Page Happy Flow', async ({page})=>{
    await openLoginPagePractise(page);
    await loginWithCredentials(page, "rahulshettyacademy", "learning");
    await page.locator('#terms').click();
    await page.locator('#signInBtn').click();
})

test('@Web Login with incorrect username', async ({page})=>{
    await openLoginPagePractise(page);
    await loginWithCredentials(page, "rahulshettyacademy1", "learning");
    await page.locator('#terms').click();
    await page.locator('#signInBtn').click();
    await expect(page.locator("[style*=block]")).toContainText("Incorrect")
})

test('@Web Login with incorrect password', async ({page})=>{
    await openLoginPagePractise(page);
    await loginWithCredentials(page, "rahulshettyacademy", "learning1");
    await page.locator('#terms').click();
    await expect (page.locator('#terms')).toBeChecked();
    await page.locator('#terms').uncheck()
    expect (await page.locator('#terms').isChecked()).toBeFalsy();
    await page.locator('#signInBtn').click();
    await expect(page.locator("[style*=block]")).toContainText("Incorrect")
})

test('@Web Log in with Terms and conditions checkbox ticked should be mandatory', async ({page})=>{
    await openLoginPagePractise(page);
    await loginWithCredentials(page, "rahulshettyacademy", "learning");
    await page.locator('#signInBtn').click();
    await expect(page.locator("[style*=block]")).toContainText("Please indicate that you have read and agree to the Terms and Conditions and Privacy Policy")
})

test('@Web Login as a user will trigger a popup to be displayed', async ({page})=>{
    await openLoginPagePractise(page);
    await loginWithCredentials(page, "rahulshettyacademy", "learning");
    await page.locator('#terms').click();
    await page.locator('#usertype').nth(1).click();
    await expect(page.locator('#usertype').nth(1)).toBeChecked();
    await expect(page.locator(".modal-body p")).toContainText("You will be limited");
    await page.locator('#cancelBtn').click();
    await page.locator('#usertype').first().click();
    await expect(page.locator('#usertype').first()).toBeChecked();
    await page.locator('#usertype').nth(1).click();
    await expect(page.locator(".modal-body p")).toContainText("You will be limited");
    await page.locator('#okayBtn').click();
    await page.locator('#signInBtn').click();   
})

test('@Web Select options from dropdown', async ({page})=>{
    await openLoginPagePractise(page);
    await loginWithCredentials(page, "rahulshettyacademy", "learning");
    await page.locator('#terms').click();
    await page.selectOption('select.form-control', "teach") //selectOption('locator', 'optiontoselect')
    await page.selectOption('select.form-control', "consult")
    await page.selectOption('select.form-control', "stud")
    await page.locator('#signInBtn').click();   
})


test('@Web Link text has blicking class and opens in new tab', async ({page})=>{

    const documentsLink =  page.locator('[href*="documents-request"]');
    
    await openLoginPagePractise(page);
    await loginWithCredentials(page, "rahulshettyacademy", "learning");
    await( expect (documentsLink).toHaveAttribute('class', 'blinkingText'));
    await( expect (documentsLink).toHaveClass('blinkingText'));
    
})

test('@Web Child window handling test', async ({browser}) =>{

    const context = await browser.newContext();
    const page  = await context.newPage()
    await openLoginPagePractise(page);

    const documentsLink =  page.locator('[href*="documents-request"]');
    const [newPage] = await Promise.all([  //[newPage] - const will be an array]
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

test('Abort request calls', async({page})=>{

  
    page.route('**/*.css', route => route.abort());
    page.route('**/*.{jpg, png, jpeg}', route => route.abort()); //('**/* ) regular expression -> select all files that have this extension

    page.on('request', request=> console.log(request.url()));
    page.on('response', response=> console.log(response.url(), response.status()));

    //  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    // await page.pause();

    await openLoginPagePractise(page);
    await loginWithCredentials(page, "rahulshettyacademy", "learning");
    await page.locator('#terms').click();
    await page.selectOption('select.form-control', "teach") //selectOption('locator', 'optiontoselect')
    await page.selectOption('select.form-control', "consult")
    await page.selectOption('select.form-control', "stud")

    await page.pause();

    
    // await page.locator('#signInBtn').click();  
})

//npx playwright codegen 'URL' - to record flows