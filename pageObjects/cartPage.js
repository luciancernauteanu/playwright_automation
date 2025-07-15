class CartPage{
    constructor(page){
        this.page = page;
        this.cart = page.getByRole('button', { name: 'Checkout' })
    }

    async goTocheckout (){
        await this.cart.click();
    }
}

module.exports={CartPage};