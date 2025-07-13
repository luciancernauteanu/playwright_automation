const {test, expect, request} = require('@playwright/test');
const { OpenApplication } = require('../utils/E2E_eCommerce/OpenApplication.js');
const {email, password} = {email: "lucian_test@gmail.com", password: "testPass1"};
let webContext;

//Login UI -> collect all storage state from the browser and formating to a JSON file for future injecting in new sessions
test.beforeAll(async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await OpenApplication(page);
    
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(password);
    await page.locator('input[type="submit"]').click();
    await expect(page.getByLabel("Login Successfully")).toBeEnabled()

    await context.storageState({ path: 'state.json' });

    webContext = await browser.newContext({
        storageState: 'state.json'})
})

//test cases uses the same browser context as the login session (the same storage state file (state.json))
test('I can complete order with skipping login with injecting storageState ', async () => {
   const page = await webContext.newPage();

   await OpenApplication(page);

   // Navigate to the products page
    const productCard = page.locator('.card').filter({ hasText: 'ADIDAS ORIGINAL' });

    // add product to cart
    await productCard.getByRole('button', { name: 'Add To Cart' }).click();
    await expect (page.getByLabel("Product Added To Cart")).toBeEnabled();

    // Navigate to the cart
    await page.locator('button[routerlink="/dashboard/cart"]').click();

    //check if the cart contains the product
    await expect (page.locator('.cartSection').filter({ hasText: 'ADIDAS ORIGINAL' })).toContainText('ADIDAS');
    await page.getByRole('button', { name: 'Checkout' }).click();

    // Verify the email field in the checkout form contains the correct email
    const checkoutEmailInput = await page.locator('.user__name  input[type="text"]').inputValue();
    expect(checkoutEmailInput).toBe(email);

    // Select the country from the dropdown
    await page.getByPlaceholder('Select Country').type("Ro", { delay: 100 }); // Type with delay to trigger the dropdown
    const countryOptions =  page.locator('.ta-results')
    await countryOptions.waitFor({ state: 'visible' }); // Wait for the dropdown to be visible
    const optionsCount = await countryOptions.locator('button').count();
    console.log(`${optionsCount}`);

    for (let i = 0; i < optionsCount; i++) {
        const option = countryOptions.locator('button').nth(i);
        const optionText = await option.textContent();
        if (optionText === " Romania") {
            await option.click();
            break;
        }
    }
    // type name on card and CVV code
    const nameOnCard = email.split('@')[0];
    await page.locator('div.title:has-text("Name on Card") + input[type="text"]').fill(nameOnCard);
    await page.locator('div.title:has-text("CVV Code ?") + input[type="text"]').fill('123');

    //add coupon code
    await page.locator("input[name='coupon']").fill('rahulshettyacademy');
    await page.getByRole('button', { name: 'Apply Coupon ' }).click();
    await expect(page.getByText('* Coupon Applied')).toBeVisible();   

    // Click on the Place Order button
    await page.locator('a').filter({hasText: 'Place Order' }).click();
    
    //check if the order was placed successfully
    await expect(page.locator('h1.hero-primary')).toContainText('Thankyou for the order.');

    const actualOrderIdUnsplit= await page.locator('label.ng-star-inserted').textContent();
    console.log(`${actualOrderIdUnsplit}`);
    const arrayText = actualOrderIdUnsplit.split(" "); // Extract the order ID from the label text
    const actualOrderId = arrayText[2]; // Assuming the order ID is the third element in the array
    console.log(`${actualOrderId}`);

    //go to the orders history page
    await page.locator('label[routerlink="/dashboard/myorders"]').click();
    await page.locator('tbody tr').waitFor();

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

    //  await page.close();
    
})

test('test case 2 showing that st', async () => {
   const page = await webContext.newPage();

    await OpenApplication(page);

    await page.locator('button[routerlink="/dashboard/myorders"]').click();

    await page.rou
    expect(await page.locator('div .mt-4')).toBeVisible();
  
})