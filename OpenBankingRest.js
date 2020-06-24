const http = require('http');
var Client = require('node-rest-client').Client;
var qs = require('querystring');
const request = require('request');
var mysql = require('mysql');
var express = require("express");  
var app = express();
var url = require('url');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
var client = new Client();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended : true }));

var crypto = require('crypto');
var dbConfig = require('./dbConfig');

var client_id = 'WEWQOmFI1cOpoMz3GIDNkjWnf5bTvRG2cpGbBjyn';
var client_secret = 'dBpgHLmuXxnKbdOU81j7GWoRu5H1QP7hKZP7vqe8';
var redirect_uri = 'http://141.223.124.10:8080/Token';


app.get('/', function(req, res){
    console.log('web accessed');
  	res.render(__dirname+'/main.html');
});
function statusCodeErrorHandler(statusCode) {
    switch (statusCode) {
        case 200:
            console.log('restAPI success');
            break;
        default:
            console.log('restAPI fail'+statusCode.toString());
            break;
    }
}
app.post("/Auth",function(req,res){
    //Aouthorize
    console.log('Authorize start');
    var web_address="https://testapi.openbanking.or.kr/oauth/2.0/authorize?response_type=code";
    var redirect_uri='&redirect_uri=http://141.223.124.10:8080/Token&scope=login+inquiry+transfer&state=01101010100001001111010111111111&auth_type=0';
    web_address=web_address.concat('&client_id=',client_id,redirect_uri);
    console.log(web_address);
    client.get(web_address, function (data, response) {
        //console.log(Object.keys(data));
        statusCodeErrorHandler(response.statusCode);
        console.log(response.responseUrl);
        //res.render(response.responseUrl);
        res.writeHead(301,
            {Location:response.responseUrl}
          );
        res.end();
        //res.end(objToString(response));
    });
	var obj={};
    //res.render(__dirname+'/main.html',obj);
});

app.get("/Token",function(req,res){
    console.log('Get Token start');
    var uri = req.url;
    var query = url.parse(uri, true).query;
    var code = query.code;
    console.log('code : '+code);
    const options = {
        uri:'https://testapi.openbanking.or.kr/oauth/2.0/token', 
        method: 'POST',
        form: {
            code: code, 
            client_id : client_id, 
            client_secret : client_secret, 
            redirect_uri : redirect_uri,
            grant_type : 'authorization_code'
        }
      }
    request.post(options, function(err,httpResponse,body){ 
        //console.log(body);
        //console.log(typeof(body));
        body=JSON.parse(body);
        //console.log(Object.keys(body));
        var token = body.access_token;
        console.log('Token : '+ token);
        var dbOptions = {
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database
         };         
        var conn = mysql.createConnection(dbOptions);
        conn.connect();
        var sql = 'UPDATE TB_USER SET bank_token=? WHERE app_id=? AND app_pw=?';
        var params = [token, 'user1', '1111'];
        conn.query(sql, params, function(err, rows, fields){
            if(err){
                console.log(err);
            } else {
                console.log(rows);
            }
        });
    });
});

app.get("/Transfer",function(req,res){

});

var server = app.listen(8080, function () {
  console.log('load Success!');
});
 
