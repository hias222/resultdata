var fs = require('fs');
var unzipper = require('unzipper')

//module.exports = async function unzip(filename) {

function unzipFile(fileName, outputPath) {
    return new Promise((resolve, reject) => {
        let createdFile = fileName
        let stream = fs.createReadStream(createdFile)
            .pipe(unzipper.Extract({ path: outputPath }));

        stream.on('finish', () => {
            resolve(outputPath);
        });

        stream.on('error', () => {
            console.log('file unzipped');
            reject('error extract ' + fileName + ' to ' + outputPath);
        });
    });
}

var unzip = async function (fileName) {
    return new Promise((resolve, reject) => {

        //var lenexfile = __dirname + '/../uploads/' + filename;

        //var lenexfile = __dirname + '/../' + process.env.LENEX_LXF_FILE_NAME;
        var lenexfile =fileName
        var destfilename = __dirname + '/../' + process.env.LENEX_LEF_FILE_NAME;
        var destlenexpath = __dirname + '/../resources'

        console.log("<incoming> check " + lenexfile)
        console.log("<incoming> dest " + destfilename)


        fs.promises.access(lenexfile, fs.F_OK)
            .then(() => unzipFile(lenexfile, destlenexpath))
            .then((data) => {
                return resolve(data)
            })
            .catch((err) => {
                return reject(err)
            })

    });

}
//
exports.unzip = unzip;

//}
