require('dotenv').config();
const pm2Config = require('../../ecosystem.config').apps[0].env;
var config = {};
config.assistant = {};

config.assistant = {
    url: process.env.WATSON_URL || pm2Config["WATSON_URL"],
    assistantId: process.env.ASSISTANT_ID || pm2Config["ASSISTANT_ID"],
    apiKey: process.env.APIKEY || pm2Config["WATSON_APIKEY"],
    version: process.env.WATSON_VERSION || pm2Config["WATSON_VERSION"]
};

config.mongodb = {
    uri: process.env.MONGODB_URI || pm2Config["MONGODB_URI"],
    db: process.env.MONGODB_DB || pm2Config["MONGODB_DB"],
    form_collection: process.env.MONGODB_FORM_COLLECTION || pm2Config["MONGODB_FORM_COLLECTION"]
};

module.exports = config;