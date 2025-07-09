
async function openLoginPagePractise(page) {
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
}

async function loginWithCredentials(page, username, password){ 
    await page.locator('#username').fill(username);
    await page.locator('#password').fill(password);
    } 


    module.exports = {openLoginPagePractise, loginWithCredentials}