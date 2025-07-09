const {test, expect, context} = require('@playwright/test');
const { formRegisterHelper } = require('../utils/formRegisterHelper');
const { OpenParabankApplication} = require('../utils/OpenParabankApplication');
const { getUserData, getFirstName, getLastName, getAddress, getCity, getState, getZip, getPhone, getSSN, getUsername, getPassword} = require('../utils/TestData');



test('Top Level Menu is displayed', async ({page}) => {

    await OpenParabankApplication(page);  
    const topNavItems = page.locator('.leftmenu li');
    await expect(topNavItems).toHaveText([
        'Solutions', 
        'About Us', 
        'Services', 
        'Products', 
        'Locations', 
        'Admin Page'
    ]);
    expect(await topNavItems.allTextContents()).toHaveLength(6);
})

test('Check top level menu links are redirecting correctly', async ({page}) =>{
    await OpenParabankApplication(page);
    const topNavItems = page.locator('.leftmenu a');
    await topNavItems.first().click();
    await expect(page.locator('h1.title')).toContainText("ParaSoft Demo Website")
    await topNavItems.nth(1).click();
    await expect(page.locator('#rightPanel .heading').first()).toContainText("Available Bookstore");
    await topNavItems.nth(2).click();
    await expect(page).toHaveURL('https://www.parasoft.com/products/');
    await page.goBack();
    await topNavItems.nth(3).click();
    await expect(page).toHaveURL('https://www.parasoft.com/solutions/');
    await page.goBack();
    await topNavItems.nth(4).click();
    await expect(page.locator('h1.title')).toHaveText("Administration");
})

test('User can register on ParaBank', async ({page}) => {
    
    await OpenParabankApplication(page);  
    await page.click('text=Register');
    await formRegisterHelper(page, getUserData());
    await page.click("[value='Register']")
    await expect(page.locator("h1.title")).toHaveText(`Welcome ${getUsername()}`);
    await expect (page.locator("#rightPanel p")).toHaveText("Your account was created successfully. You are now logged in.");
    await expect (page.locator(".smallText")).toHaveText(`Welcome ${getFirstName()} ${getLastName()}`);
})

test ('When logging out, the cookies are invalidated', async ({page})=>{

    
    await OpenParabankApplication(page);  
    await page.click('text=Register');
    await formRegisterHelper(page, getUserData());
    await page.click("[value='Register']")

    
})

test ('Logged In User has a list of option to select', async ({page})=>{
    
    await OpenParabankApplication(page); 
    
    // const browserContext = page.context();
    // await browserContext.clearCookies();
    
    // browserContext.addCookies([
    //     {
    //         name: 'JSESSIONID',
    //         value: '919191B3B873EA2E9B28CB7F57BE4A13',
    //         domain: 'parabank.parasoft.com',
    //         path: '/parabank',
    //         expires: -1,
    //         size: 42,
    //         httpOnly: true,
    //         secure: false,
    //         sameSite: 'Lax'
    //     },
    // ]);

    await page.locator('input[name="username"]').fill(getUsername());
    await page.locator('input[name="password"]').fill(getPassword());
    await page.click('input[type="Submit"]');


    const itemList = page.locator("#leftPanel a");
        await expect(itemList).toHaveText([
                    'Open New Account',
                    'Accounts Overview',
                    'Transfer Funds',
                    'Bill Pay',
                    'Find Transactions',
                    'Update Contact Info',
                    'Request Loan',
                    'Log Out'
                    ]);
    expect(await itemList.allTextContents()).toHaveLength(8);
    
})

