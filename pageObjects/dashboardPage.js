class DashboardPage {

    constructor(page){
        this.page = page;
        this.cart = this.page.locator('button[routerlink="/dashboard/cart"]');
        
    }

    async searchProductAddToCart(productName) {
        const productCard = this.page.locator('.card').filter({ hasText: productName });
        await productCard.getByRole('button', { name: 'Add To Cart' }).click();
    }

    async goToCart (){ 
        await this.cart.click();
    }
}

module.exports={DashboardPage};