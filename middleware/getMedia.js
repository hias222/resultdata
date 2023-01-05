const path = require("path");
const fs = require("fs");

var media_directory = process.env.WEB_MEDIA_PATH;

module.exports = function getMedia(request, response, next) {
  console.log("<getLenexData.js> mode getMedia");
  var query_mode = request.query;
  console.log(query_mode);

  if (query_mode.delete === undefined) {
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
  } else {
    var delete_file = media_directory + "/" + query_mode.delete;
    console.log("delete_file" + delete_file);

    fs.promises
      .unlink(delete_file)
      .then((data) => {
        var stringJson = "{'delete':'" + delete_file + "'}";
        response.body = stringJson;
        next();
      })
      .catch((err) => {
        var stringJson = {};
        stringJson.error = err;
        response.body = stringJson;
        next();
        console.log(err);
      });
  }
};
