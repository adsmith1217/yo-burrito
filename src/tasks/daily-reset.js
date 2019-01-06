
'use strict'

const mysql = require('mysql')
const connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL)

console.log('daily reset scheduled job')

let dailyResetQuery = `UPDATE burritos_by_user SET daily_allowance = 5;`
console.log('dailyResetQuery', dailyResetQuery)

connection.query(dailyResetQuery, (err, rows, fields) => {
    if (err) throw err
    console.log('daily reset success')
})

return