const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const socket = require('socket.io')(http);
const pm2Config = require('./ecosystem.config').apps[0].env;

const routes = require('./app/routes/Routes');

// Port Number
require('dotenv').config({
    silent: true
});

const port = process.env.PORT || process.env.VCAP_APP_PORT || pm2Config["PORT"];

app.use(cors({origin: 'http://localhost:3001'}))

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

let rooms = {};

socket.on('connection', function (socket) {
    let room = socket.handshake.query.room;

    if (rooms[room] === undefined) {
        rooms[room] = 0;
    }

    rooms[room] = rooms[room] + 1;

    socket.join(room);

    socket.on('toggle-chat', function (data) {
        socket.in(data.room).emit('toggle-chat', data);
    });

    socket.on('open-chat', function (data) {
        socket.in(data.room).emit('open-chat', data);
    });

    socket.on('loaded-iframe', function (data) {
        socket.in(data.room).emit('loaded-iframe', data);
    });
});

