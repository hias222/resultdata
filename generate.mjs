import get_file_data from './scripts/getfilestructure.mjs';
import dotenv from 'dotenv'

if (process.argv.length === 2) {
    console.error('Expected at least one argument! Sot MEeting name');
    process.exit(1);
  }

const shortMeetingName= process.argv[2]
dotenv.config()

const downloadBasePath = "splashdata/" + shortMeetingName

// Installs
// npm install directory-tree
// npm i node-fetch

//const filepath = "/Volumes/colorado/splash/react"
const filepath = process.env.WEB_LOCAL_FILE_PATH + "/" + shortMeetingName
/*
Data Generated out of meet programm - pdf's
paste to subfolders
- entries
- certificates
*/

const wsClubServer = process.env.WEB_RESULT_BACKEND_SERVER
/*
this is backend of admin Server
--> upload lxf file to the Result tab
*/

const exportFileName = process.env.DEST_EXPORT_FILE_NAME + '/' + shortMeetingName + '/downloads.json' 

console.info('using ' + filepath)
console.info('Server ' + wsClubServer)
console.info('exportFilename ' + exportFileName)
console.info('')

get_file_data(filepath, wsClubServer, exportFileName, downloadBasePath)