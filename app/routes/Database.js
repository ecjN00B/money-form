const express = require('express');
const router = express.Router();

global.db = require('../../db');

exports.saveAnswer = (req, res, next) => {
    let answer = req.body.answer;
    let formId = req.body.formId;
    if (formId) {
        global.db.saveAnswer(formId, answer, (err, result) => {
            if (err) res.status(500).json(err);
            else res.status(200).json({
                message: 'Answer cadastrada com sucesso!'
            })
        })
    } else {
        res.status(400).json({
            message: 'AnswerObject Inválido'
        })
    }
}

exports.getForm = (req, res, next) => {
    global.db.getForm(async (err, result) => {
        if (err) res.status(500).json(err);
        res.json(result[0]);
    })
}

exports.insertUpdateForm = (req, res, next) => {
    if (req.body.form) {
        global.db.insertUpdateForm("1", req.body, (err, result) => {
            if (err) res.status(500).json(err);
            else res.json({
                message: 'Form cadastrado com sucesso!'
            })
        })
    } else {
        res.json({
            message: 'FormObject Inválido'
        })
    }

}