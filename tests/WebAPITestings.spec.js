const {test, expect, request} = require('@playwright/test');
const { OpenApplication } = require('../utils/E2E_eCommerce/OpenApplication.js');
const {APIUtils} = require('../utils/E2E_eCommerce/APIUtils.js');

const loginPayload = {userEmail: "lucian_test@gmail.com", userPassword: "testPass1"};
const orderIdPayload = {orders: [{country: "Romania", productOrderedId: "67a8df56c0d3e6622a297ccd"}]};
const fakePayLoadOrders = {"data":[],"message":"No Orders"};


let response;

    test.beforeAll(async () => {
        const apiContext = await request.newContext();
        const apiUtils = new APIUtils(apiContext, loginPayload);
        const token = await apiUtils.getToken();
        response = await apiUtils.placeOrder(orderIdPayload);

        apiContext.post('https://rahulshettyacademy.com/api/ecom/order/get-orders-details?');
    })

test('Check using API if orderID is parsed to orders history page', async ({page}) => {
    
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

    // await page.close();

})

//altering the response
test('Check using API if orders page have no orders', async ({page}) => {
    
    await page.addInitScript(value =>{
            window.localStorage.setItem('token', value);
        }, response.token
    );

    await OpenApplication(page);

    //intercepting the response body-> API response -> browser-> {playwright fakeresponse} -> browser will render data to frontend
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/68735e516eb377753098708d", async route => 
        {
            //fake response
            route.fulfill({     
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(fakePayLoadOrders),
            })  
    });

    await page.locator('button[routerlink="/dashboard/myorders"]').click();
    await expect( page.locator('.mt-4')).toContainText('No Orders');
    // await page.close();
})


//altering the request
test('Check if parsing orderId from a different account is not authorized', async ({page}) => {
    await page.addInitScript(value =>{
            window.localStorage.setItem('token', value);
        }, response.token
    );
    await OpenApplication(page);

    await page.locator('button[routerlink="/dashboard/myorders"]').click();
   
    const orderId = response.orderId;
    console.log(`Order ID: ${orderId}`);

    page.route(`https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=${orderId}`, async route => 
        { route.continue({
            url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=6873d36c6eb37775309987a7' //using orderId from a different account
            })
        })

    await page.locator('button:has-text("View")').first().click();
    await expect(page.locator(".blink_me")).toContainText("You are not authorize");
    await page.pause()

        
    


})




