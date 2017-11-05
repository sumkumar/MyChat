var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1:27017';
mongoose.connect(mongoDB, {
  useMongoClient: true
});

//Get the default connection
var db = mongoose.connection;

db.on('connected', function () {  
  console.log('Mongoose default connection open to ' + mongoDB);
}); 

// If the connection throws an error
db.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
db.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});//Bind connection to error event (to get notification of connection errors)

