var Sequelize = require('sequelize')

var rdsEndpoint = {
  host: 'mydbinstance.ciphmkjlituk.ap-northeast-2.rds.amazonaws.com',
  port: 3306
};

var sequelize = new Sequelize('mydbinstance', 'admin', 'dowklee123', {
  host: rdsEndpoint.host,
  port: rdsEndpoint.port
});

// MySQL DB 테이블 생성
sequelize.sync();

 exports.pool = sequelize

//
// var mysql = require('mysql'),
//     pool = mysql.createPool({
//         host      : 'localhost',
//         user      : 'root',
//         password  : 'dongdb',
//         database  : 'mysql',
//         dateStrings:true
//     })
// exports.pool = pool
