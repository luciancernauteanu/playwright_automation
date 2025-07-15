const {expect} = require('@playwright/test');

class APIUtils{
    constructor(apiContext, loginPayload) {
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }
    async getToken() {
        //request to login using POST -> use payload -> get token as response in JSON format
       const loginResponse = await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login', {
            data: this.loginPayload
        })

     // Check if the login response is successful          
        expect(loginResponse.ok()).toBeTruthy();
        const loginJsonResponse = await loginResponse.json();
        const token = loginJsonResponse.token;
        console.log(token);
    
        return token;
    }
    async placeOrder(orderIdPayload) {
        //request to place an order using POST -> use payload -> get orderId as response in JSON format
        
        let response = {};
        response.token = await this.getToken();

        const orderIdResponse = await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order', {
            data: orderIdPayload,
            headers: { 
                'Authorization': response.token, 
                'Content-Type': 'application/json' 
            },
        })

        // Check if the order creation response is successful
        expect(orderIdResponse.ok()).toBeTruthy();
        const orderJsonResponse = await orderIdResponse.json();
        const orderId = orderJsonResponse.orders[0]; 
        response.orderId = orderId;

        return response;
    }
}

module.exports = {APIUtils};