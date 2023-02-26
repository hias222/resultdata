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
                console.log('Entry ' + result.name + ' -> entries/' + entriesname)
                var newFile = { 'entriesfile': '../entries/' + entriesname }
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
                console.log('Certs ' + result.name + ' -> certificates/' + certsname)
                var newFile = { 'certsfile': '../certificates/' + certsname }
                var newclub = { ...result, ...newFile }
                club_data.push(newclub)
            } else {
                club_data.push(result)
            }
            resolve(club_data)
        })
    })

}

function add_common_data(data, common_tree) {
    return new Promise(function (resolve) {

        var common_data = []

        common_tree.children.map(result => {
            console.log('Common ' + result.name)
            var newFile = {
                'name': result.name,
                'link': '../common/' + result.name
            }
            common_data.push(newFile)
        })

        var newData = { 'common': common_data, 'clubs': data }
        resolve(newData)
    })
}

function get_file_data(filepath, wsClubServer, exportFileName) {

    console.log("download file in " + exportFileName)

    var wsClubURL = "http://" + wsClubServer + "/resultdata/getevent?mode=downloadlist"

    console.log("Query " + wsClubURL)

    var downloadData = {}

    var certs_folder = filepath + '/certificates'
    var entries_folder = filepath + '/entries'
    var common_folder = filepath + '/common'

    const entries_tree = dirTree(entries_folder);
    const certs_tree = dirTree(certs_folder);
    const common_tree = dirTree(common_folder);

    fs.promises.access(certs_folder, fs.constants.F_OK)
        .then(() => {
            console.log('OK ' + certs_folder)
            return fs.promises.access(entries_folder, fs.constants.F_OK)
        })
        .then(() => {
            console.log('OK ' + entries_folder)
            return fs.promises.access(common_folder, fs.constants.F_OK)
        })
        .then(() => {
            console.log('OK ' + common_folder)
            return fetch(wsClubURL)
        })
        .then(response => response.json())
        .then(data => add_entries_data(data, entries_tree))
        .then(data => add_certs_data(data, certs_tree))
        .then(clubdata => add_common_data(clubdata, common_tree))
        .then((commondata) => fs.promises.writeFile(exportFileName, JSON.stringify(commondata)))
        .then(() => console.log('export file: ' + exportFileName))
        .catch((error) => console.log(error))
}

export default get_file_data;