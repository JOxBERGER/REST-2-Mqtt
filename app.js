var mqttBrocker = 'mqtt://test.mosquitto.org';
var mqttBaseTopic = 'this/is/a/long/topic/right';
var mqttID = 'itsme'
var webservicePort = 8080;

//////////////////////////////////////
var express = require('express');
var app = express();
var port = process.env.PORT || webservicePort;

var mqtt    = require('mqtt');
var client  = mqtt.connect(mqttBrocker);

// connect MQTT
client.on('connect', function () {
  console.log('MQTT client connected to brocker: '+ mqttBrocker);
  client.publish(mqttBaseTopic, Date.now() + ' - MQTT client:  ' + mqttID + '  connected');
});

// start server
app.listen(port);
console.log('Server started! At http://localhost:' + port);


app.get('/', function (req, res) {
  res.send('Hello to the root!');
});

// mini api. example: http://localhost:8080/api/mqtt?topic=drink&payload=wine&qos=1
app.get('/mqtt/:topic/:payload/:qos/:retain', function(req, res) {
  var mqttTopic = req.params.topic;
  var mqttPayload = req.params.payload;
  var mqttQos = req.params.qos;
  var mqttRetain = req.params.retain;

  var report = 'received topic: ' + mqttTopic + ' payload: ' + mqttPayload + ' QOS: ' + mqttQos + ' retain: ' + mqttRetain;
  res.send(report);
  console.log(report);

  client.publish(mqttTopic, mqttPayload, mqttQos)
});

// serve static site
app.use(express.static('minisite'));
