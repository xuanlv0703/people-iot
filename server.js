var express 		= require("express");
var app 			= express();
var client 			= require("./client.js");
var config 			= require('./config');
var http 			= require('http').Server(app);
var port 			= config.port;

var io = require('socket.io')(http);
var mqtt = require('mqtt');
var multipart = require('connect-multiparty');

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
    http.listen(port, function() {
        console.log("All right ! I am alive at Port '" + port + "'.");
    });
     dataEmitHTML();
}


new REST();
