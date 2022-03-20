var mqtt_handler = require('../mqtt/mqtt_handler');

//var mqttInternalClient = new mqtt_handler();
//mqttInternalClient.connect();

module.exports = function sendMqttData (request, response, next) {
    console.log('<mid:sendMqttData> Message to do');
    next();
  }