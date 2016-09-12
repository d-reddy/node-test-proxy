var config = {};

config.sql = {};
config.sql.server = 'localhost';
config.sql.user = 'dbuser';
config.sql.pwd = 'dbpwd'

config.sql.db_1 = 'AdventureWorks'
config.sql.db_2 = 'AdventureWorks'

config.endpoint_1 = {};
config.endpoint_1.url = 'http://localhost:REPLACE_PORT?someParm=REPLACE_VALUE'
config.endpoint_1.postData = "{ 'someKey' : REPLACE_VALUE }";

module.exports = config;
