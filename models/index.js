/*
  Copyright 2016 Google, Inc.

  Licensed to the Apache Software Foundation (ASF) under one or more contributor
  license agreements. See the NOTICE file distributed with this work for
  additional information regarding copyright ownership. The ASF licenses this
  file to you under the Apache License, Version 2.0 (the "License"); you may not
  use this file except in compliance with the License. You may obtain a copy of
  the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
  License for the specific language governing permissions and limitations under
  the License.
*/

'use strict';

let {google} = require('googleapis');
//var config = require(path.join(__dirname, '/../config.json')).database;
var path = require('path');
let privatekey = require(path.join(__dirname, "/../creds/privatekey.json"));
let sheets = google.sheets('v4');
let spreadsheetId = '1_VigXfrqJr2Yyvuq57zJB1z_a5F5Negm0OJn_3QHjQ8';
let sheetName = 'Sheet2'

var db = {};

// configure a JWT auth client
let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets',
     'https://www.googleapis.com/auth/drive',
     'https://www.googleapis.com/auth/calendar']);

function init() {
  return new Promise((resolve, reject) => {
    //authenticate request
    jwtClient.authorize((err, tokens) => {
        if (err) {
          reject(err);
        } else {
          resolve(true)
        }
    });
  });
}
    
function collections() {
    return new Promise((resolve, reject) => {
        sheets.spreadsheets.values.get({
            auth: jwtClient,
            spreadsheetId: spreadsheetId,
            range: sheetName,
        } ,(err, resp) => {
            if (err) {
                console.log('Data Error Getting Collections :', err)
                reject(err);
            }

            var ret = []

            if (resp.data && resp.data.values.length > 1 && resp.data.values[0][0] === "Period") {
                for (let row of resp.data.values) {
                    if (row[0] != "Period") {
                        ret.push({
                            period: row[0],
                            start: row[1],
                            end: row[2]
                        })
                    }
                }         
            }

            resolve(ret);
        });
    });
}


db.init = init;
db.collections = collections

module.exports = db;
