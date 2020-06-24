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
var cntr_account_num = '8391005757';
var fintech_use_num = '199163791057884753460751';
var bank_tran_id = 'T991637910U123456780';
var req_client_account_num = '1231231230';

var dbOptions = {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
};  

app.get('/', function(req, res){
    console.log('web accessed');
  	res.render(__dirname+'/main.html');
});
var server = app.listen(8080, function () {
    console.log('load Success!');
  });
   

app.post("/Auth",function(req,res){
    var conn = mysql.createConnection(dbOptions);
    conn.connect();
    var token;
    var sql = 'SELECT bank_token FROM TB_USER WHERE app_id=? AND app_pw=?';
    var params = [ 'user1', '1111'];
    conn.query(sql, params, function(err, rows, fields){
        if(err){
            console.log(err);
        } else {
            token = rows[0].bank_token;
            console.log(token);
            console.log('Transfer start');
            let date_ob = new Date();
            let date = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = String(date_ob.getFullYear());
            let hours = String(date_ob.getHours());
            let minutes = String(date_ob.getMinutes());
            let seconds = String(date_ob.getSeconds());
            if (hours.length==1)hours='0'+hours;
            if (minutes.length==1)minutes='0'+minutes;
            if (seconds.length==1)seconds='0'+seconds;
            var tran_dtime = parseInt(year + month + date + hours + minutes + seconds);
            console.log(tran_dtime);
            let options = {
                uri: 'https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num',
                method: 'POST',
                headers:{
                    Authorization : 'Bearer '+token,
                    'Content-Type': 'application/json'
                },
                body:{
                    bank_tran_id:bank_tran_id,
                    cntr_account_type : 'N',
                    cntr_account_num : cntr_account_num,
                    dps_print_content : 'Charge',
                    fintech_use_num : fintech_use_num,
                    tran_amt : 100,
                    tran_dtime : tran_dtime,
                    req_client_name : "남석현",
                    req_client_bank_code : '097',
                    req_client_account_num : req_client_account_num,
                    req_client_num : 'NAMSUKHYUN1234',
                    transfer_purpose : "RC"
                },
                json:true 
            };
            request.post(options, function(err,httpResponse,body){ 
                console.log(body);
                console.log(typeof(body));
            });
        }
    });
});

app.post("/Check",function(req,res){
    var conn = mysql.createConnection(dbOptions);
    conn.connect();
    var token;
    var sql = 'SELECT bank_token FROM TB_USER WHERE app_id=? AND app_pw=?';
    var params = [ 'bank', '0000'];
    conn.query(sql, params, function(err, rows, fields){
        if(err){
            console.log(err);
        } else {
            token = rows[0].bank_token;
            console.log(token);
            console.log('Transfer check start');
            let date_ob = new Date();
            let date = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = String(date_ob.getFullYear());
            let hours = String(date_ob.getHours());
            let minutes = String(date_ob.getMinutes());
            let seconds = String(date_ob.getSeconds());
            if (hours.length==1)hours='0'+hours;
            if (minutes.length==1)minutes='0'+minutes;
            if (seconds.length==1)seconds='0'+seconds;
            var tran_dtime = year + month + date + hours + minutes + seconds;
            console.log(tran_dtime);
            let options = {
                uri: 'https://testapi.openbanking.or.kr/v2.0/transfer/result',
                method: 'POST',
                headers:{
                    Authorization : 'Bearer '+token,
                    'Content-Type': 'application/json'
                },
                body:{
                    check_type : '1',
                    tran_dtime : parseInt(tran_dtime),
                    req_cnt : 1,
                    req_list : [
                        {
                            tran_no : 1,
                            org_bank_tran_id : bank_tran_id,
                            org_bank_tran_date : parseInt(tran_dtime.substring(0,8)),
                            org_tran_amt : 100
                        }
                    ]
                },
                json:true 
            };
            request.post(options, function(err,httpResponse,body){ 
                console.log(body);
                console.log(typeof(body));
            });
        }
    });
});