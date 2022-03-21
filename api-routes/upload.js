const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const IncomingForm = require('formidable').IncomingForm

require('dotenv').config();
util = require('util');

module.exports = function upload(req, res) {

    var form = new IncomingForm()
    var originalUploadFilename='unknown'
    form.parse(req);

    form.on('fileBegin', function (name, file) {
        //file.filepath = process.env.LENEX_BASE_DIR + '/' + file.originalFilename;
        file.filepath = __dirname + '/../resources/' + file.originalFilename;
        originalUploadFilename = file.originalFilename;
    });

    form.on('file', function (name, file) {
        console.log('<upload.js> Upload ' + file.originalFilename + ' to ' + file.filepath);
    });

    form.once('end', (name,file) => {

        var HTTP_REST_PORT = typeof process.env.HTTP_REST_PORT !== "undefined" ? process.env.HTTP_REST_PORT : 3002;
        let getdataurl = "http://localhost:" + HTTP_REST_PORT + '/resultdata/getevent'
        let paramurl = getdataurl + '?' + new URLSearchParams({ 'mode': 'update', 'lenexfile': originalUploadFilename })

        fetch(paramurl)
            .then(response => {
                console.log('<api-routes/upload.js> Upload Process finished ');
            })
            .catch((error) => {
                console.log(error)
            })
    });

}