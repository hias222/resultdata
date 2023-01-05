const path = require("path");
const fs = require("fs");

var media_directory = process.env.WEB_MEDIA_PATH;

module.exports = function getMedia(request, response, next) {
  console.log("<getLenexData.js> mode getMedia");

  fs.promises
    .readdir(media_directory)
    .then((filenames) => {
      return filenames;
    })
    .then((files) => {
      response.body = files;
      next();
    })
    .catch((err) => {
      var stringJson = "{'error':'" + media_directory + "'}";
      response.body = stringJson;
      next();
      console.log(err);
    });

};
