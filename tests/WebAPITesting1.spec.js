const {test, expect, request} = require('@playwright/test');
const { OpenApplication } = require('../utils/E2E_eCommerce/OpenApplication');

const loginPayload = {userEmail: "John_1752218042255@gmail.com", userPassword: "testPass1"}
const orderIdPayload = {orders: [{country: "Romania", productOrderedId: "67a8df56c0d3e6622a297ccd"}]};

let token;
let actualOrderId;

    test.beforeAll(async () => {
        const apiContext =  await request.newContext();

     //request to login using POST -> use payload -> get token as response in JSON format
       const loginResponse = await apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login', {
            data: loginPayload
        })

     // Check if the login response is successful          
        expect(loginResponse.ok()).toBeTruthy();
        const loginJsonResponse = await loginResponse.json();
        token = loginJsonResponse.token;
        console.log(token);

        //request to place an order using POST -> use payload -> get orderId as response in JSON format
         const orderIdResponse = await apiContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order', {
            data: orderIdPayload,
            headers: { 
                'Authorization': token, 
                'Content-Type': 'application/json' 
            },
        })
        
        const orderJsonResponse = await orderIdResponse.json();
        console.log(orderJsonResponse)
        actualOrderId = orderJsonResponse.orders[0];
        console.log(orderIdResponse.status());
        expect(orderIdResponse.ok()).toBeTruthy();
    })


test.only('Check using API if orderID is parsed to orders history page', async ({page}) => {
    
    await page.addInitScript(value =>{
            window.localStorage.setItem('token', value);
        }, token
    );

    await OpenApplication(page);


    await page.locator('button[routerlink="/dashboard/myorders"]').click();
    await page.locator('tbody').waitFor(); 
    const rows = page.locator('tbody tr');

    for (let i = 0; i < await rows.count(); i++) {
        const rowOrderId = await rows.nth(i).locator('th').textContent();
        if ( actualOrderId.includes(rowOrderId)) {
            console.log(`Order ID found: ${rowOrderId}`);
            await rows.nth(i).locator('button').first().click();
            break;
        }
    }

    const orderIdDetails = await page.locator('div.-main').textContent();
     expect((orderIdDetails).includes(actualOrderId)).toBeTruthy(); 

     await page.close();

})