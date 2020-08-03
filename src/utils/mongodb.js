var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://db1:27017/";
var database = "extracted-images";
var tableName = "list";

const insertOne = (imgLocation, parentPage) => MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db(database);
  var myobj = { imgLocation, parentPage };
  dbo.collection(tableName).insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});

const fetchAll = () => new Promise((resolve, reject) => {
  MongoClient.connect(url, function(err, db) {
    if (err) reject(err);
    var dbo = db.db(database);
    dbo.collection(tableName).find({}).toArray(function(err, result) {
      if (err) reject(err);
      db.close();
      resolve(result);
    });
  }); 
})

module.exports = { insertOne, fetchAll }