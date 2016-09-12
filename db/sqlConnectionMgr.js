
// Require mssql to connect to sql server and execute
// db commands
var sql = require('mssql');

// Require configuration for application
var config = require('../config.js');

var sqlConnectionMgr = (function(){

    var sqlConfig = {
        user: config.sql.user,
        password: config.sql.pwd,
        server: config.sql.server,
        database: config.sql.db_classic,
        requestTimeout: 240000,
        options: {
            encrypt: true
        }
    };

    var query = function(repo, params, callback){

      sql.connect(sqlConfig).then(function() {

        var sqlRequest = new sql.Request();

        console.log("executing query.");

        sqlRequest.query(repo.fetchSql(params), function (err, recordset) {
            if (err){
              console.log(err);
            } else
            {
              console.log('query executed.');
              callback(recordset);
            }
        });
        // TODO: SHOULD CONNECTION BE CLOSED HERE, OR SOMEWHERE ELSE?
      }).catch(function (err) {
  	    // ... connect error checks
        console.log(err);
      });
    }
    return {
      query: query
    };
})();

module.exports = sqlConnectionMgr;
