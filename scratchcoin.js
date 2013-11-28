var express = require('express');
var app = express();
var http = require("http");

var reporters={};



app.get('/', function(req, res){
  console.log('ScratchCoin Start.....');
  res.send('ScratchCoin Start.....');
});

app.get('/poll', function(req, res){
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write("aaa 100\n\r"+"bbb 500\n\r"+"addressreceived/123 999\n\r");
  //res.write("addressreceived/12m9Z56Ujvb5zeK7vxhsNm6dkLJYDFXbSn 1999\n\r");
  for (var e in reporters) {
    res.write(e+' '+reporters[e]+'\n\r');
    var t = reporters[e];
  }
  res.end();
});


app.get('/getreceivedbyaddress/:address', function(req, res){

var text = '';

var options = {
  hostname: 'blockchain.info',
  port: 80,
  path: '/q/getreceivedbyaddress/'+req.params.address,
  method: 'GET'
};

var call = http.request(options, function(resp) {
  resp.setEncoding('utf8');
  resp.on('data', function (chunk) {
    text = chunk;	
    console.log('Result: ' + chunk);
    //reporters[req.originalUrl.slice(1)]=chunk;//
    reporters['addressreceived/'+req.params.address]=chunk;
    res.send(req.originalUrl.slice(1));//+'  '+reporters[req.originalUrl.slice(1)]);
  });
});

call.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

call.end();

});


app.get('/addressbalance/:address', function(req, res){

var text = '';

var options = {
  hostname: 'blockchain.info',
  port: 80,
  path: '/q/addressbalance/'+req.params.address,
  method: 'GET'
};

var call = http.request(options, function(resp) {
  resp.setEncoding('utf8');
  resp.on('data', function (chunk) {
    text = chunk;	
    console.log('Addressbalance Result: ' + chunk);
    reporters['addressbalance/'+req.params.address]=chunk;
    res.send(req.originalUrl.slice(1));
  });
});

call.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

call.end();

});


app.get('/updateUSDRate', function(req, res){

var text = '';

var options = {
  hostname: 'blockchain.info',
  port: 80,
  path: '/q/24hrprice',
  method: 'GET'
};

var call = http.request(options, function(resp) {
  resp.setEncoding('utf8');
  resp.on('data', function (chunk) {
    text = chunk;	
    console.log('Rate Result: ' + chunk);
    reporters['exchangerate/USD']=chunk;
    res.send(req.originalUrl.slice(1));
  });
});

call.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

call.end();

});

app.listen(8080);
