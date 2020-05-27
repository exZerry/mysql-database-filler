const http = require('http');
const path = require('path');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(request, response){
    response.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/senddata', function(request, response){
    
    console.log(request.body);
    var connection = mysql.createConnection({
        host: request.body.sqlconf.host,
        user: request.body.sqlconf.user,
        password: request.body.sqlconf.password,
        database: request.body.sqlconf.database
    });
    connection.connect(function(err) {
        if(err) {
            console.log(err);
            response.send(err);
        }
        else {
            console.log("Database connection established");
            var sqlTable = request.body.sqlconf.table;
            var sql = `INSERT INTO ${sqlTable} (site_id, url, override_url) VALUES ?`;
            var values = request.body.sqldata;
            connection.query(sql, [values], function(err, result) {
                if(err) {
                    console.log(err);
                    response.send(err);
                }
                else {
                    console.log("Inserted records: " + result.affectedRows);
                    response.status(200).send('ok');
                }            
            });
        }        
    });
    
});

const server = http.createServer(app);
server.listen(3000);