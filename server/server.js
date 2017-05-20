process.env.NODE_CONFIG_DIR = './server/config';
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var mongoose = require('mongoose');
var config = require('config');

var app = express();

app.use("/", express.static('www'));

mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.host, function(err) {
  if (err) {
    console.log("Connection issue: " + err)
  } else {
    console.log("Success connect");
  }
});

var Order = mongoose.model('Order', {
  firstname : String,
  lastname  : String,
  phone     : String,
  email     : String,
  city      : String,
  address   : String,
  delivery  : Boolean
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post("/delivery/add", function(req, res) {
  var newOrder = new Order(req.body);
  newOrder.save(function(err) {
    if (err) {
      return res.status(500).json({messages: [err.message || err.stack], error: true});
    } else {
      res.send(newOrder);
    }
  });
});


app.listen(3000, function() {
  console.log("I'm running on http://localhost:3000")
});