var express = require("express");
var cors = require('cors');
var app = express();
var router = express.Router();
var upload = require('./api-routes/upload')
var configuration = require('./api-routes/configuration')
var health = require('./api-routes/health');
const showevent = require("./api-routes/showevent");
const getevent = require("./api-routes/getevent");

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.options('*', cors());

// Routes
router.use(function (req,res,next) {
  console.log('/' + req.method + ' ' + req.baseUrl + req.path);
  next();
});

router.get('/', health);
router.get('/configuration', configuration)
router.get('/getevent', getevent)

router.post("/upload", upload)
router.post("/showevent", showevent)

app.use('/resultdata', router);

var HTTP_REST_PORT = typeof process.env.HTTP_REST_PORT !== "undefined" ? process.env.HTTP_REST_PORT : 3002;

var server = app.listen(HTTP_REST_PORT, function () {
    console.log("app running on port.", server.address().port);
});