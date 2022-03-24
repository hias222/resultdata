const mqtt = require('mqtt');
require('dotenv').config();

var lastMessage = '';
var ConnectedRaw = false;

//this.host = 'mqtt://localhost';

var mqtt_local_url = typeof process.env.SOURCE_MQTT_HOST !== "undefined" ? process.env.SOURCE_MQTT_PROT + '://' + process.env.SOURCE_MQTT_HOST + ':' + process.env.SOURCE_MQTT_PORT : 'mqtt://localhost'
var mqtt_username_local = typeof process.env.MQTT_USERNAME_LOCAL !== "undefined" ? process.env.MQTT_USERNAME_LOCAL : 'mqtt';
var mqtt_password_local = typeof process.env.MQTT_PASSWORD_LOCAL !== "undefined" ? process.env.MQTT_PASSWORD_LOCAL : 'mqtt';

var debug = process.env.MQTT_DEBUG === 'true' ? true : false;

var SendMessage = '';

var settings = {
  keepalive: 2000,
  username: mqtt_username_local,
  password: mqtt_password_local,
  clientId: 'handler_' + Math.random().toString(16).substr(2, 8)
};

class MqttHandler {
  constructor() {
    //super(onMessageChange);
    this.mqttClient = null;
    this.rawtopic = 'mainchannel'
    this.host = mqtt_local_url;
    this.connectToMqtt = this.connectToMqtt.bind(this)
    //autoBind(this);
  }

  connectToMqtt() {
    if (debug) console.log(settings)
    this.mqttClient = mqtt.connect(this.host, settings);
  }

  connect() {
    return new Promise((resolve, reject) => {
      // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
      //this.mqttClient = mqtt.connect(this.host, { username: this.username, password: this.password });

      this.connectToMqtt()
      //this.mqttClient = mqtt.connect(this.host, settings);

      // Mqtt error calback
      this.mqttClient.on('error', (err) => {
        console.log(err);
        ConnectedRaw = false;
        this.mqttClient.end();
        reject()
      });

      // Connection callback
      this.mqttClient.on('connect', () => {
        if (debug) console.log(`<mqtt_handle> raw client connected to ` + mqtt_local_url);
        ConnectedRaw = true;
        resolve()
      });

      // mqtt subscriptions
      //this.mqttClient.subscribe(this.rawtopic, { qos: 0 });

      // When a message arrives, console.log it
      /*
      this.mqttClient.on('message', function (topic, message) {
        if (debug) console.log("<mqtt_handle> datamapping incoming " + message.toString());
        //SendMessage = messageMapper.mapMessage(message)
        lastMessage = message;
      });
      */

      this.mqttClient.on('close', (err) => {
        console.log(`<mqtt_handle> raw client disconnected ` + this.host);
        console.error(err)
        //SendMessage = messageMapper.mapMessage("connection abort")
        ConnectedRaw = false;
      });
    });
  }

  // Sends a mqtt message to topic: mytopic
  sendRawMessage(message) {
    return new Promise((resolve, reject) => {
      this.mqttClient.publish(this.rawtopic, message);
      resolve()
    });
  }

  getLastMessage() {
    return lastMessage;
  }

  getLastSendMessage() {
    return SendMessage;
  }

  getStatus() {
    return new Promise((resolve, reject) => {
      if (ConnectedRaw) {
        resolve()
      } else {
        this.connect()
          .then(() => resolve())
          .catch(() => reject());
      }
    });
  }

  getSendStatus() {
    return messageMapper.getsendStatus();
  }
}

module.exports = MqttHandler;
