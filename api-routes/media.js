const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const IncomingForm = require("formidable").IncomingForm;

require("dotenv").config();
util = require("util");

module.exports = function upload(req, res) {
  var form = new IncomingForm();
  var originalUploadFilename = "unknown";
  form.parse(req);

  form.on("fileBegin", function (name, file) {
    file.filepath = process.env.WEB_LOCAL_FILE_PATH + '/' + file.originalFilename;
    //file.filepath = __dirname + "/../resources/" + file.originalFilename;
    originalUploadFilename = file.originalFilename;
  });

  form.on("file", function (name, file) {
    console.log(
      "<upload.js> Upload " + file.originalFilename + " to " + file.filepath
    );
  });

  form.once("end", (name, file) => {
    console.log(
      "<api-routes/media.js> Upload Process finished " + name + " - " + file
    );
  });
};
