const {expect} = require('@playwright/test');
const {generateRandomEmail} = require('./generateRandomEmail'); // Import the function to generate random email


async function userRegistration (page) {

    let user = {
        firstName: "John",
        lastName: "Doe",
        email: generateRandomEmail(), // Use the function to generate a random email
        phone: "1234567890",
        password: "testPass1"
    };

    
    await page.locator('a[href*="register"]').click();
    await page.locator('#firstName').fill(user.firstName);
    await page.locator('#lastName').fill(user.lastName);
    await page.locator('#userEmail').fill(user.email);

    await page.locator('#userMobile').fill(user.phone);
    await page.selectOption('.custom-select','2: Student');
    await page.locator('input[value="Male"]').click();

    await page.locator('#userPassword').fill(user.password);
    await page.locator('#confirmPassword').fill(user.password);

    await page.locator('input[type="checkbox"]').click();
    expect(page.locator('input[type="checkbox"]')).toBeChecked();
    expect(page.locator('input[type="checkbox"]')).toHaveClass(/ng-valid/); //when element have multiple classes, use regex to match
    await page.locator('input[type="submit"]').click();

    return {
        email: user.email,
        password: user.password
    };
}

module.exports = { userRegistration};