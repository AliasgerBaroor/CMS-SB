const { Redis }  = require('ioredis');

const notificationClient = new Redis();

module.exports = notificationClient;