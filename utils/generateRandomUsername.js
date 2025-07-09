
function generateRandomUsername() {
  return `user_${Date.now()}`;
}

module.exports = {generateRandomUsername};