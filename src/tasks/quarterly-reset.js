
'use strict'

const mysql = require('mysql');
let connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL);
console.log('console log - quarterly reset scheduled job');

let quarterlyResetQuery = `UPDATE burritos_quarterly SET total_burritos = 0;`;
console.log('console log - quarterlyResetQuery', quarterlyResetQuery);

connection.on('close', function (err) {
    console.log('console log - connection closed quarterly-reset');
});

connection.on('error', function (err) {
    console.log('console log - connection error quarterly-reset: ' + err);
});

connection.query(quarterlyResetQuery, (err, rows, fields) => {
    if (err) {
        console.log('console log - error quarterlyResetQuery: ' + err.code);
        throw err;
    }
    console.log('console log - quarterly reset success');
})

connection.end(function (err) {
    if (err) {
        console.log('console log - error ending connection quarterly-reset: ' + err.code);
        throw err;
    }
    console.log('console log - connection ended on purpose quarterly-reset');
    // The connection is terminated now
});

return;