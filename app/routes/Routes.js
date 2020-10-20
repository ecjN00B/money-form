const express = require('express');
const path = require('path');
const router = express.Router();

const database = require('./Database');

router
  .get('/db/form', database.getForm)
  .post('/db/form', database.insertUpdateForm)
  .post('/db/form/answer', database.saveAnswer)

router
  .get('/form', (req, res) => res.sendFile(path.join(__dirname, '../../public/index.html')));

module.exports = router;