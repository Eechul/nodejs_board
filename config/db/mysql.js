
var mysql = require('mysql'),
    pool = mysql.createPool({
        // connectionLimit : 15,
        host      : 'localhost',
        user      : 'root',
        password  : 'dongdb',
        database  : 'mysql'
    })
exports.pool = pool
