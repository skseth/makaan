'use strict';
var path = require('path');
let privatekey = require(path.join(__dirname, "/../creds/privatekey.json"));
let {google} = require('googleapis');
let sheets = google.sheets('v4');

class GoogleAppsClient {

    constructor() {
        this.jwtClient = new google.auth.JWT(
            privatekey.client_email,
            null,
            privatekey.private_key,
            ['https://www.googleapis.com/auth/spreadsheets',
             'https://www.googleapis.com/auth/drive',
             'https://www.googleapis.com/auth/calendar']);        
    }

    init() {
        return new Promise((resolve, reject) => {
            //authenticate request
            this.jwtClient.authorize((err, tokens) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true)
                }
            });
        });
    }
      
    listSheet(spreadsheetId, sheetName) {
        return new Promise((resolve, reject) => {
            sheets.spreadsheets.values.get({
                auth: this.jwtClient,
                spreadsheetId: spreadsheetId,
                range: sheetName,
            } ,(err, resp) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(resp);
                }
            });
        });
    }
}

var gac = {}
gac.GoogleAppsClient = GoogleAppsClient

module.exports = gac;
