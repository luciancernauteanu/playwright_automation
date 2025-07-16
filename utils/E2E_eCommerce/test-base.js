const test = require('@playwright/test');

exports.customTest = test.extend({
    testDataForOrder:  {
      username: "lucian_test@gmail.com",
      password: "testPass1",
      productName: "ADIDAS ORIGINAL"
    
  }
})