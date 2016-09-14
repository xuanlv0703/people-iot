var express 	= require("express");
var app 		= express();
// Add headers
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // Pass to next layer of middleware
    next();
});

var client 		= require("./client.js");
var config 		= require('./config');
var http 		= require('http').Server(app);
var port        = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ipadr       = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var io          = require('socket.io')(http);
var mqtt        = require('mqtt');
var multipart   = require('connect-multiparty');

function REST() {
    var self = this;
    self.configureExpress();
};

function dataEmitHTML() {
    var server = mqtt.connect('tcp://172.16.0.69:1883', {
        username: 'admin',
        password: 'admin'
    });
    io.on('connection', function(socket) {
        console.log('connected.');
    })
    server.on('connect', function() {
        server.subscribe('positions');
        server.on('message', function(topic, message) {
            if ('positions' === topic) {
                message = JSON.parse(message);
                io.emit('data', message);
            }
        });
    });
} 

REST.prototype.configureExpress = function() {
    var self = this;

    app.use(express.static(__dirname));
    app.use(express.static(__dirname + '/assets'));
    app.use(multipart({
        uploadDir: './uploads'
    }));
    var client_router = express.Router();
    app.use("/", client_router);
    var client_router_app = new client(client_router);

    self.startServer();
}

REST.prototype.startServer = function() {
    app.listen(port, ipadr);
    console.log('Server running on ' + ipadr + ':' + port);
    dataEmitHTML();
}

new REST();
