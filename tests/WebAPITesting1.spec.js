const {test, expect, request} = require('@playwright/test');
const { OpenApplication } = require('../utils/E2E_eCommerce/OpenApplication');
const {APIUtils} = require('../utils/E2E_eCommerce/APIUtils.js');

const loginPayload = {userEmail: "John_1752244644452@gmail.com", userPassword: "testPass1"};
const orderIdPayload = {orders: [{country: "Romania", productOrderedId: "67a8df56c0d3e6622a297ccd"}]};

let response;

    test.beforeAll(async () => {
        const apiContext = await request.newContext();
        const apiUtils = new APIUtils(apiContext, loginPayload);
        const token = await apiUtils.getToken();
        response = await apiUtils.placeOrder(orderIdPayload);

    })


test.only('Check using API if orderID is parsed to orders history page', async ({page}) => {
    
    await page.addInitScript(value =>{
            window.localStorage.setItem('token', value);
        }, response.token
    );

    await OpenApplication(page);


    await page.locator('button[routerlink="/dashboard/myorders"]').click();
    await page.locator('tbody').waitFor(); 
    const rows = page.locator('tbody tr');

    for (let i = 0; i < await rows.count(); i++) {
        const rowOrderId = await rows.nth(i).locator('th').textContent();
        if ( response.orderId.includes(rowOrderId)) {
            console.log(`Order ID found: ${rowOrderId}`);
            await rows.nth(i).locator('button').first().click();
            break;
        }
    }

    const orderIdDetails = await page.locator('div.-main').textContent();
     expect((orderIdDetails).includes(response.orderId)).toBeTruthy(); 

     await page.close();

})