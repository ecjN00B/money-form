const express = require('express');
const path = require('path');
const router = express.Router();

const database = require('./Database');
const watson = require('./Watson');

router
  .post('/watson/message', watson.message);

router
  .get('/db/welcome', database.getWelcome)
  .post('/db/welcome', database.saveWelcome)
  .post('/db/dialogs/upsert', database.saveDialog);

router
  .get('/index', (req, res) => res.sendFile(path.join(__dirname, '../../public/index.html')));

module.exports = router;