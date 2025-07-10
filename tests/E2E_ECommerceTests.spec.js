const {test, expect} = require('@playwright/test');
const { OpenApplication } = require('../utils/E2E_eCommerce/OpenApplication');
const { userRegistration, getEmail, getPassword } = require('../utils/E2E_eCommerce/userRegistrationAction.js');

test('User is able to complete a purchase', async ({page}) => {
    // Open the application and register a new user
    await OpenApplication(page);

    // Store email and password into variables as String for later use
    const { email, password } = await userRegistration(page);
    console.log(`${email}, ${password}`);

    //check if the registration was successful
    await expect(page.locator('h1[class="headcolor"]')).toContainText('Successfully');
    await expect(page.getByLabel('Registered Successfully')).toBeEnabled()

    await page.getByRole('button', { name: 'Login' }).click();

    // Log in with the registered user credentials
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(password);

    await page.locator('input[type="submit"]').click();
    // Check if the login was successful
    await expect(page.getByLabel("Login Successfully")).toBeEnabled()

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

    const orderIdUnsplit= await page.locator('label.ng-star-inserted').textContent();
    console.log(`${orderIdUnsplit}`);
    const arrayText = orderIdUnsplit.split(" "); // Extract the order ID from the label text
    const orderId = arrayText[2]; // Assuming the order ID is the third element in the array
    console.log(`${orderId}`);

    //go to the orders history page
    await page.locator('label[routerlink="/dashboard/myorders"]').click();

    //check if the order history page contains the order ID
    await expect(page.locator(`th:has-text("${orderId}")`).last()).toContainText(orderId);
})
