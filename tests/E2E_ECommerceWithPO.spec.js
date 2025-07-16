const {test, expect} = require('@playwright/test');
const { customTest } = require('../utils/E2E_eCommerce/test-base');
const {POManager} = require('../pageObjects/PageObjectManager.js')

const dataSet = JSON.parse(JSON.stringify(require('../utils/E2E_eCommerce/E2E_ECommerceWithPOTestData.json')));

for(const data of dataSet){
    test(`User is able to complete a purchase with user: ${data.username}`, async ({page}) => {
        
        const poManager = new POManager(page);
        const logInPage = poManager.getLoginPage();
        
        await logInPage.OpenApp();
        expect(await page.title()).toBe("Let's Shop");
        await logInPage.validLogin(data.username, data.password);
    
        await expect(page.getByLabel("Login Successfully")).toBeEnabled();
        
        const dashboardPage = poManager.getDashboardPage();
        await dashboardPage.searchProductAddToCart(data.productName);

    
        await expect(page.getByLabel("Product Added To Cart")).toBeEnabled();
        await dashboardPage.goToCart();


        //check if the cart contains the product
        const cartPage = poManager.getCartPage();
        await expect (page.locator('.cartSection').filter({ hasText: data.productName })).toContainText(data.productName);
        await cartPage.goTocheckout();

        // Verify the email field in the checkout form contains the correct email
        expect(await page.locator('.user__name  input[type="text"]').inputValue()).toBe(data.username);

        const checkoutPage = poManager.getCheckOutpage();
        await checkoutPage.completeShippingInfo('Romania', checkoutPage.nameOnCard(data.username), '123', 'rahulshettyacademy');
        await expect(page.getByText('* Coupon Applied')).toBeVisible(); 
        await checkoutPage.placeOrder();
        await expect(page.locator('h1.hero-primary')).toContainText('Thankyou for the order.');
        
        //check if the order was placed successfully
        
        const actualOrderIdUnsplit= await page.locator('label.ng-star-inserted').textContent();
        console.log(`${actualOrderIdUnsplit}`);
        const arrayText = actualOrderIdUnsplit.split(" "); // Extract the order ID from the label text
        const actualOrderId = arrayText[2]; // Assuming the order ID is the third element in the array
        console.log(`${actualOrderId}`);

        //go to the orders history page
        await page.locator('label[routerlink="/dashboard/myorders"]').click();
        // Wait for at least one row to appear in the orders table
        await page.locator('tbody tr').nth(0).waitFor();

        //check if the order history page contains the order ID
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
}

customTest('User is able to complete a purchase with user', async ({page, testDataForOrder }) => {
        
        const poManager = new POManager(page);
        const logInPage = poManager.getLoginPage();
        
        await logInPage.OpenApp();
        expect(await page.title()).toBe("Let's Shop");
        await logInPage.validLogin(testDataForOrder.username, testDataForOrder.password);
    
        await expect(page.getByLabel("Login Successfully")).toBeEnabled();
        
        const dashboardPage = poManager.getDashboardPage();
        await dashboardPage.searchProductAddToCart(testDataForOrder.productName);

    
        await expect(page.getByLabel("Product Added To Cart")).toBeEnabled();
        await dashboardPage.goToCart();


        //check if the cart contains the product
        const cartPage = poManager.getCartPage();
        await expect (page.locator('.cartSection').filter({ hasText: testDataForOrder.productName })).toContainText(testDataForOrder.productName);
        await cartPage.goTocheckout();

        // Verify the email field in the checkout form contains the correct email
        expect(await page.locator('.user__name  input[type="text"]').inputValue()).toBe(testDataForOrder.username);

        const checkoutPage = poManager.getCheckOutpage();
        await checkoutPage.completeShippingInfo('Romania', checkoutPage.nameOnCard(testDataForOrder.username), '123', 'rahulshettyacademy');
        await expect(page.getByText('* Coupon Applied')).toBeVisible(); 
        await checkoutPage.placeOrder();
        await expect(page.locator('h1.hero-primary')).toContainText('Thankyou for the order.');
        
        //check if the order was placed successfully
        
        const actualOrderIdUnsplit= await page.locator('label.ng-star-inserted').textContent();
        console.log(`${actualOrderIdUnsplit}`);
        const arrayText = actualOrderIdUnsplit.split(" "); // Extract the order ID from the label text
        const actualOrderId = arrayText[2]; // Assuming the order ID is the third element in the array
        console.log(`${actualOrderId}`);

        //go to the orders history page
        await page.locator('label[routerlink="/dashboard/myorders"]').click();
        // Wait for at least one row to appear in the orders table
        await page.locator('tbody tr').nth(0).waitFor();

        //check if the order history page contains the order ID
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

