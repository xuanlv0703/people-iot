var express 	= require("express");
var app 		= express();
var client 		= require("./client.js");
var config 		= require('./config');
var http 		= require('http').Server(app);
var port        = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ipadr       = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var io          = require('socket.io')(http);
var mqtt        = require('mqtt');
var multipart   = require('connect-multiparty');


var socketAddress = '';
if (location.hostname !== 'localhost') {
  if (location.protocol === 'https:') {
    socketAddress = 'wss://' + location.hostname + ':8443';
  } else {
    socketAddress = 'ws://' + location.hostname + ':8000';
  }
}


function REST() {
    var self = this;
    self.configureExpress();
};

function dataEmitHTML() {
    var server = mqtt.connect('tcp://172.16.0.69:1883', {
        username: 'admin',
        password: 'admin'
    });
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
