const {expect} = require('@playwright/test');
const {generateRandomEmail} = require('./generateRandomEmail'); // Import the function to generate random email

const user = {
    firstName: 'John',
    lastName: 'Smith',
    email: `${generateRandomEmail()}`, // Use the function to generate a random email''
    phone: '5755568877',
    password: 'testPass1'
}

async function userRegistration (page) {
    
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

    console.log(user.email)
    console.log(user.password)

    return {
        email: user.email,
        password: user.password
    };
}

module.exports = { userRegistration};