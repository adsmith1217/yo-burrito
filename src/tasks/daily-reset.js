
'use strict'

const mysql = require('mysql');
let connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL);
console.log('console log - daily reset scheduled job');

let dailyResetQuery = `UPDATE burritos_by_user SET daily_allowance = 5;`;
console.log('console log - dailyResetQuery', dailyResetQuery);

connection.on('close', function (err) {
    console.log('console log - connection closed');
});

connection.on('error', function (err) {
    console.log('console log - connection error: ' + err);
});

connection.query(dailyResetQuery, (err, rows, fields) => {
    if (err) {
        console.log('console log - error code: ' + err.code);
        throw err;
    }
    console.log('console log - daily reset success');
})

connection.end(function (err) {
    if (err) {
        console.log('console log - error code: ' + err.code);
        throw err;
    }
    console.log('console log - connection ended on purpose');
    // The connection is terminated now
});

return;