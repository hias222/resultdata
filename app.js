var express = require("express");
var cors = require('cors');
var app = express();
var router = express.Router();
var upload = require('./api-routes/upload')
var health = require('./api-routes/health');

var loggerMiddleware = require('./middleware/loggerMiddleware')
var getLenexData = require('./middleware/getLenexData')

const getevent = require("./api-routes/getevent");

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(loggerMiddleware);

app.options('*', cors());

router.get('/', health);
router.get('/getevent', getLenexData, getevent)
router.post("/upload", upload)

app.use('/resultdata', router);

var HTTP_REST_PORT = typeof process.env.HTTP_REST_PORT !== "undefined" ? process.env.HTTP_REST_PORT : 3002;

var server = app.listen(HTTP_REST_PORT, function () {
  console.log("app running on port.", server.address().port);
});