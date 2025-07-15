class LoginPage {

    constructor(page){
        this.page = page;
        this.signInButton = this.page.locator('[value="Login"]');
        this.username = this.page.locator('input[type="email"]');
        this.password = this.page.locator('input[type="password"]');
    }

    async validLogin(username, password){
        await this.username.type(username);
        await this.password.type(password);
        await this.signInButton.click();
    }

    async OpenApp (page){
        await this.page.goto('https://rahulshettyacademy.com/client/');
        
    }
}

module.exports={LoginPage};