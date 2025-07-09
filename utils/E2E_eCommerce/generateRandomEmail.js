
function generateRandomEmail() {
  return `John_${Date.now()}@gmail.com`;
}

module.exports = { generateRandomEmail };