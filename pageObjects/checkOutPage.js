class CheckOutPage{
    constructor(page){
        this.page = page;
        this.country = this.page.getByPlaceholder('Select Country') // Type with delay to trigger the dropdown
        this.countryOptions = this.page.locator('.ta-results')
        this.cardName = this.page.locator('div.title:has-text("Name on Card") + input[type="text"]');
        this.cvvNum = this.page.locator('div.title:has-text("CVV Code ?") + input[type="text"]')
        this.optionsCount =  this.countryOptions.locator('button');
        this.couponField = this.page.locator("input[name='coupon']");
        this.applyCoupon = this.page.getByRole('button', { name: 'Apply Coupon ' });
        this.placeOrderButton = this.page.locator('a').filter({hasText: 'Place Order' });
        

    }
     nameOnCard(username) {
       return `${username}`.split('@')[0];
     } 

    async completeShippingInfo (country, nameOnCard, cvv, couponCode){
        await this.country.type(country, { delay: 100 });
        await this.countryOptions.waitFor({ state: 'visible' }); // Wait for the dropdown to be visible
        console.log(`${this.optionsCount}`);


        for (let i = 0; i < await this.optionsCount.count(); i++) {
        const option = await this.countryOptions.locator('button').nth(i);
        const optionText = await option.textContent();
        if (optionText === ` ${country}`) {
            await option.click();
            break;
            }
        }
        
        await this.cardName.fill(nameOnCard);
        await this.cvvNum.fill(cvv);


        //add coupon code
    await this.couponField.fill(couponCode); //rahulshettyacademy
    await this.applyCoupon.click();
    }

    async placeOrder(){
        await this.placeOrderButton.click();
    }
}

module.exports={CheckOutPage}