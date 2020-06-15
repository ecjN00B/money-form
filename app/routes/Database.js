const express = require('express');
const router = express.Router();

const assistant = require('../services/assistant')

global.db = require('../../db');

exports.saveDialog = (req, res, next) => {
    const newDoc = {
        convId: '',
        dialog: null
    }
    if (req.body.conversation_id) {
        newDoc["convId"] = req.body.conversation_id;
        newDoc["dialog"] = req.body.dialog;

        global.db.insertUpdateMsgDialogs(newDoc, (err, result) => {
            if (err) res.status(500).json(err);
            else res.json({
                message: 'Dialog cadastrado com sucesso!'
            })
        })
    } else {
        res.json({
            message: 'DialogObject Inválido'
        })
    }

}

exports.getWelcome = (req, res, next) => {
    global.db.getWelcomeNode(async (err, result) => {
        if (err) res.status(500).json(err);
        const sessionId = await assistant.createSession();
        result[0].sessionId = sessionId;
        res.json(result[0]);
    })
}

exports.saveWelcome = (req, res, next) => {
    if (req.body.output.generic) {
        global.db.insertUpdateWelcomeNode("1", req.body, (err, result) => {
            if (err) res.status(500).json(err);
            else res.json({
                message: 'Welcome cadastrado com sucesso!'
            })
        })
    } else {
        res.json({
            message: 'WelcomeObject Inválido'
        })
    }

}