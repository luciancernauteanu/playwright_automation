const { generateRandomUsername } = require('./generateRandomUsername');

//test data
console.log(generateRandomUsername());
const user = {
    firstName: 'John',
    lastName: 'Doe',
    address: 'TV 24 street',
    city: 'Iasi',
    state: 'Romania',
    zip: '700685',
    phone: '0755568877',
    ssn: '12345678910',
    username: generateRandomUsername(),
    password: 'testPass'
}
function getUserData(){
    return user;
}
function getFirstName(){
    return user.firstName;
}
function getLastName(){
    return user.lastName;
}
function getAddress(){
    return user.address;
}
function getCity(){
    return user.city;
}
function getState(){
    return user.state;
}
function getZip(){
    return user.zip;
}
function getPhone(){
    return user.phone;
}
function getSSN(){
    return user.ssn;
}
function getUsername(){
    return user.username;
}
function getPassword(){
    return user.password;
}

module.exports = {
    getUserData,
    getFirstName,
    getLastName,
    getAddress,
    getCity,
    getState,
    getZip,
    getPhone,
    getSSN,
    getUsername,
    getPassword,
}
