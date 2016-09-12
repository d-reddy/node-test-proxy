// Require configuration for application
var config = require('../config.js');

var documentRepository = (function() {

    var fetchSql = function(sqlParams) {

      if (!!!sqlParams.count) {
        sqlParams.count = 10;
      }

      if (!!!sqlParams.page) {
        sqlParams.page = 0;
      }

      var sql = 'select distinct * from ' +
        config.sql.db_1 + '.dbo.[TODO_TABLE_NAME_1] v join ' +
        config.sql.db_2 + '.dbo.[TODO_TABLE_NAME_1] c on c.id = v.id ' +
        "where v.[TODO_COL_NAME] != '[TODO_SOME_STRING]'";

        //paging sql
        var pagingSql = 'select top ' + sqlParams.count + ' * from( ' +
        'select *, ROW_NUMBER() OVER (ORDER BY x.[TODO_PAGING_BY]) AS RowNum ' +
  			'from (' + sql + ') x ) z where z.RowNum > ' + sqlParams.count * sqlParams.page;

        return pagingSql;
      }

    }

    return {
      fetchSql: fetchSql
    };
})();

module.exports = documentRepository;
