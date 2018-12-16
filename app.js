var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var cors = require('cors')

var DateDiff = require('date-diff');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);






app.post("/registration",function(req,res,next){
      console.log("registration",req.body.registration);
      var name = req.body.registration.name
      var lastname = req.body.registration.lastname
      var mobile_no = req.body.registration.mobile_no
      var password = req.body.registration.password

      console.log("----",name,lastname,mobile_no,password);

      MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("facebook");

          dbo.collection("registration").find({mobile_no:mobile_no}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            if (result.length === 0) {
              var myobj = { fname:name,lastname:lastname,mobile_no:mobile_no,password:password};
              dbo.collection("registration").insertOne(myobj, function(err,ssssss) {
                if (err) throw err;
                console.log("1 document inserted");
                res.send({status:true,message:"registration inserted successfully"})
              });
            }else {
              res.send({status:false,message:"username exist"})
            }

          });
        });
})


app.post("/login",function(req,res,next){
      console.log("login",req.body);
      var loginid = req.body.login_data.name
      // var lastname = req.body.registration.lastname
      // var mobile_no = req.body.registration.mobile_no
      var password = req.body.login_data.password

      console.log("----",loginid,password);

      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("facebook");
        dbo.collection("registration").find({mobile_no:loginid,password:password}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          if (result.length == 0) {
            res.send({status:false,message:"Invalid username or password"})
          }else {
            res.send({status:true,message:"login successfully"})
          }
          db.close();
        });
      });
})



/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;


app.listen(7894,function(req,res){
  console.log("serve running on 7894");
})
