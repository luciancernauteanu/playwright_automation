const {LoginPage} = require('../pageObjects/LoginPage.js');
const {DashboardPage} = require('../pageObjects/dashboardPage.js')
const {CartPage} = require('../pageObjects/cartPage.js')
const {CheckOutPage} = require('../pageObjects/checkOutPage.js')

class POManager{

    constructor(page){
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.cartPage = new CartPage(this.page);
        this.checkOutpage = new CheckOutPage(this.page);
        this.dashbaordPage = new DashboardPage(this.page);

    }

    getLoginPage(){
        return this.loginPage;
    }
    getCartPage(){
        return this.cartPage;
    }
    getCheckOutpage(){
        return this.checkOutpage;
    }
    getDashboardPage(){
        return this.dashbaordPage;
    }
}

module.exports={POManager};
