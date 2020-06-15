const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

const config = require('../config/index');
const assistantId = config.assistant.assistantId;

const assistant = new AssistantV2({
    version: config.assistant.version,
    authenticator: new IamAuthenticator({
      apikey: config.assistant.apiKey,
    }),
    url: config.assistant.url,
});

exports.createSession = () => {
    return new Promise((resolve, reject) => {
        assistant.createSession({
            assistantId: assistantId    
        }).then(res => {
            resolve(res.result.session_id);
        }).catch(err => {
            console.log(err);
            reject(false);
        });
    });
}

exports.message = async (payload, callback) => {
    payload.assistantId = assistantId;
    assistant.message(payload)
        .then(res => {
            callback(res.result);
        }).catch(err => {
            console.log('error:' + err);
            return false;
        });
}