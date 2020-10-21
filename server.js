const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const pm2Config = require('./ecosystem.config').apps[0].env;

const routes = require('./app/routes/Routes');

// Port Number
require('dotenv').config({
    silent: true
});

const port = process.env.PORT || process.env.VCAP_APP_PORT || pm2Config["PORT"];

app.use(cors({origin: '*'}))

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('', routes);

// Start Server
http.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});