//to debug this, you can use node-inspector and start app like this
//node-debug server.js.  it will start app up and bring up a chrome debugger
//then you can navigate to your app as normal and debugger should break as
//needed

//example:
//http://127.0.0.1:1337/test?count=100&page=0&containerPort=28983&someVal=10

﻿// Require modules
var http = require("http"),
    fileSystem = require('fs'),
    path = require('path'),
    url = require('url'),
    rp = require('request-promise'),
    all = require("promise").all,
    documentRepository = require('./db/documentSqlRepository.js'),
    sqlConnectionMgr = require('./db/sqlConnectionMgr.js'),
    config = require('./config.js'),
    LINQ = require('node-linq').LINQ;

var port = process.env.port || 1337;

var server = http.createServer(function (req, res) {
    var parsedUrl = url.parse(req.url, true);
    var params = parsedUrl.query;

    if ((req.method === 'GET') && (parsedUrl.pathname === '/test')) {
        sqlConnectionMgr.query(documentRepository, params, function(recordset) {

              var promises = [];

              var output = {
                successCount: 0,
                successes: [],
                failureCount: 0,
                failures: []
              };

              var addResult = function(success, results){
                var result = {
                  results: results
                };

                if (success) {
                  output.successCount++;
                  output.successes.push(result);
                } else {
                  output.failureCount++;
                  output.failures.push(result);
                }
              }

              recordset.forEach(function(entry, index, array) {

                var url = config.endpoint_1.url;
                var data = config.endpoint_1.postData;

                url = url.replace("REPLACE_VALUE", params.someVal);
                url = url.replace("REPLACE_PORT", params.containerPort);

                data = data.replace("REPLACE_VALUE", params.someVal);

                var options = {
                    method: 'POST',
                    uri: url,
                    timeout: 600000,
                    body: data,
                    headers: {
                        'Content-Type' : 'application/x-www-form-urlencoded',
                        'Accept': 'application/json, application/xml, text/json, text/x-json, text/javascript, text/xml'
                    },
                    json: true // Automatically stringifies the body to JSON
                };

                var epReq = rp(options)
                    .then(function (body) {
                        // POST succeeded...
                        if (body.response && body.response.[TODO_RESULTS]){
                          var results = body.response.[TODO_RESULTS];
                          addResult(true, results);
                          //build a more robust output summary here
                        }
                    })
                    .catch(function (err) {
                        // POST failed...
                        addResult(false, []);
                        console.log(err);
                    });

                    promises.push(epReq);

            });

            all(promises).then(function(){
              //console.log(output);
              // Write the response HEAD
              res.writeHead(200, {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Headers": "X-Requested-With"
              });

              // Write the response body
              res.write(JSON.stringify(output));

              // End of the response
              res.end();
            })
        })
    }
    else {
        res.writeHead(404, {});
    }
});

server.timeout=600000;

// Start listening at port 1337 or the port number specified in process env port
server.listen(port);
console.log("Server is listening at port " + port);
