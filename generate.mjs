import get_file_data from './scripts/getfilestructure.mjs';

// Installs
// npm install directory-tree
// npm i node-fetch

const filepath = "/Volumes/colorado/splash/react"
/*
Data Generated out of meet programm - pdf's
paste to subfolders
- entries
- certificates
*/

const wsClubServer="ubuntu.fritz.box"
/*
this is backend of admin Server
--> upload lxf file to the Result tab
*/

const exportFileName="/Users/MFU/projects/private/schwimmen/resultdata/resources/downloads.json"

get_file_data(filepath,wsClubServer,exportFileName)