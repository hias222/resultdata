import get_file_data from './scripts/getfilestructure.mjs';
import dotenv from 'dotenv'

dotenv.config()

// Installs
// npm install directory-tree
// npm i node-fetch

//const filepath = "/Volumes/colorado/splash/react"
const filepath = process.env.WEB_LOCAL_FILE_PATH
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

const exportFileName = process.env.DEST_EXPORT_FILE_NAME

get_file_data(filepath, wsClubServer, exportFileName)