import fetch from 'node-fetch';
import dirTree from 'directory-tree';
import fs from 'fs';
import jmespath from 'jmespath';

const filepath = "/Volumes/colorado/splash"
const wsClubURL = "http://ubuntu.fritz.box/resultdata/getevent?mode=downloadlist"
//const filteredTree = dirTree("/some/path", { extensions: /\.txt/ });
// http://ubuntu.fritz.box/resultdata/getevent?mode=downloadlist

function add_entries_data(data, entries_tree) {

    return new Promise(function (resolve) {
        var club_data = []

        data.map(result => {
            var entriesname = result.code + ".pdf"
            var searchstring = "children[?name == '" + entriesname + "'].name | length(@)"
            var tmp = jmespath.search(entries_tree, searchstring);
            if (tmp === 1) {
                console.log('Entry ' + result.name + ' -> entries/' + entriesname )
                var newFile = { 'entriesfile': 'entries/' + entriesname }
                var newclub = { ...result, ...newFile }
                club_data.push(newclub)
            } else {
                club_data.push(result)
            }
            resolve(club_data)
        })
    })
}

function add_certs_data(data, certs_tree) {

    return new Promise(function (resolve) {
        var club_data = []

        data.map(result => {
            var certsname = result.code + ".pdf"
            var searchstring = "children[?name == '" + certsname + "'].name | length(@)"
            var tmp = jmespath.search(certs_tree, searchstring);
            if (tmp === 1) {
                console.log('Certs ' + result.name + ' -> certificates/' + certsname )
                var newFile = { 'certsfile': 'certificates/' + certsname }
                var newclub = { ...result, ...newFile }
                club_data.push(newclub)
            } else {
                club_data.push(result)
            }
            resolve(club_data)
        })
    })

}

function get_file_data(filepath, wsClubServer, exportFileName) {

    var wsClubURL = "http://" + wsClubServer + "/resultdata/getevent?mode=downloadlist"

    console.log("Query " + wsClubURL)

    var certs_folder = filepath + '/certificates'
    var entries_folder = filepath + '/entries'

    const entries_tree = dirTree(entries_folder);
    const certs_tree = dirTree(certs_folder);

    fs.promises.access(certs_folder, fs.constants.F_OK)
        .then(() => {
            console.log('OK ' + certs_folder)
            return fs.promises.access(entries_folder, fs.constants.F_OK)
        })
        .then(() => {
            console.log('OK ' + entries_folder)
            return fetch(wsClubURL)
        })
        .then(response => response.json())
        .then(data => add_entries_data(data, entries_tree))
        .then(data => add_certs_data(data, certs_tree))
        .then((clubdata) => fs.promises.writeFile(exportFileName, JSON.stringify(clubdata)))
        .then(() => console.log('export file: ' + exportFileName))
        .catch((error) => console.log(error))
}

export default get_file_data;