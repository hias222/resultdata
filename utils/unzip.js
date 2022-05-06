var fs = require('fs');
var unzipper = require('unzipper')

//module.exports = async function unzip(filename) {

function unzipFile(fileName, outputPath) {
    return new Promise((resolve, reject) => {

        var destfilename = fileName.split('.').slice(0, -1).join('.') + ".lef"
        var fullFileName = __dirname + '/../resources/' + fileName

        var fullDestFileName = __dirname + '/../resources/' + destfilename

        try {
            fs.unlinkSync(fullDestFileName);
            console.log("File is deleted. " + fullDestFileName);
        } catch (error) {
            console.log(error);
        }

        let createdFile = fullFileName
        let stream = fs.createReadStream(createdFile)
            .pipe(unzipper.Extract({ path: outputPath }));

        stream.on('finish', () => {
            resolve(destfilename);
        });

        stream.on('error', () => {
            console.log('file unzipped');
            reject('error extract ' + fileName + ' to ' + outputPath);
        });
    });
}

function deleteOld(fileName, outputPath) {
    return new Promise((resolve, reject) => {

        var destfilename = fileName.split('.').slice(0, -1).join('.') + ".lef"
        var fullDestFileName = __dirname + '/../resources/' + destfilename

        try {
            fs.unlinkSync(fullDestFileName);
            console.log("File is deleted. " + fullDestFileName);
        } catch (error) {
            console.log(error);
        }
        resolve(destfilename);
    });
}


var unzip = async function (fileName) {
    return new Promise((resolve, reject) => {

        var lenexfile = __dirname + '/../resources/' + fileName
        var destlenexpath = __dirname + '/../resources'
        var newFilename = ''

        fs.promises.access(lenexfile, fs.F_OK)
            .then(() => {
                console.log('<unzip.js>Delete Old ' + lenexfile)
                return deleteOld(fileName, destlenexpath)
            })
            .then(() => {
                console.log('<unzip.js> File exists ' + lenexfile)
                return unzipFile(fileName, destlenexpath)
            })
            .then((newFile) => {
                console.log('<unzip.js> extracted file name ' + newFile)
                newFilename = newFile
                return fs.promises.access(__dirname + '/../resources/' + newFile, fs.F_OK)
            })
            .then(() => {
                console.log('<unzip.js> success ' + newFilename)
                return resolve(newFilename)
            })
            .catch((err) => {
                return reject(err)
            })

    });

}
//
exports.unzip = unzip;

//}
