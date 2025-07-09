const { getUserData, getFirstName, getLastName, getAddress, getCity, getState, getZip, getPhone, getSSN, getUsername, getPassword} = require('./TestData')

async function formRegisterHelper (page){
console.log(getFirstName);
    await page.locator('input[name="customer.firstName"]').fill(getFirstName());
    await page.locator('input[name="customer.lastName"]').fill(getLastName());
    await page.locator('input[name="customer.address.street"]').fill(getAddress());
    await page.locator('input[name="customer.address.city"]').fill(getCity());
    await page.locator('input[name="customer.address.state"]').fill(getState());
    await page.locator('input[name="customer.address.zipCode"]').fill(getZip());
    await page.locator('input[name="customer.phoneNumber"]').fill(getPhone());
    await page.locator('input[name="customer.ssn"]').fill(getSSN());
    await page.locator('input[name="customer.username"]').fill(getUsername());
    await page.locator('input[name="customer.password"]').fill(getPassword());
    await page.locator('input[name="repeatedPassword"]').fill(getPassword());
}
module.exports = { formRegisterHelper };
