'use strict';

class Collections {
    static sheetName = "sheet2"
    constructor(config, gac) {
        this.spreadsheetId = config.collections.spreadsheetId;
        this.sheetName = "sheet2";
        this.gac = gac
    }

    list() {
        return this.gac.listSheet(this.spreadsheetId, this.sheetName)
        .then(resp => {
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
            } else {
                throw `Invalid format for sheet ${this.sheetName} in spreadsheet ${this.spreadsheetId}`
            }

            return ret;        
        });
    }
}

var coll = {}
coll.Collections = Collections

module.exports = coll;
