const Redis = require("ioredis")

const publisher = new Redis();
const subscriber = new Redis();

module.exports = { publisher, subscriber }