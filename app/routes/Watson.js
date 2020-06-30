// const controller
const assistant = require('../services/assistant');

exports.message = async (req, res) => {
    var payload = {
        assistantId: {},
        input: {}
    };

    if (req.body) {
        if (req.body.input) {
            payload.input = {
                'message_type': 'text',
                'text': req.body.input
            };
        }
        if (req.body.sessionId) {
            payload.sessionId = req.body.sessionId;
        } else {
            payload.sessionId = await assistant.createSession();
        }
    }

    assistant.message(payload, response => {
        if (!req.body.sessionId) {
            response.sessionId = payload.sessionId;
        } else {
            response.sessionId = req.body.sessionId;
        }
        response.input = payload.input.text;
        return res.json(response);
    });
}