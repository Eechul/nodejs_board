
var mysql = require('mysql'),
    pool = mysql.createPool({
        host      : 'localhost',
        user      : 'root',
        password  : 'dongdb',
        database  : 'mysql',
        dateStrings:true
    })
exports.pool = pool
