const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbName = 'simplegame';
function connect(callback) {
  
    MongoClient.connect(process.env.DATABASE_URL, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
       
        const db = client.db(dbName);
    
        // return callback(db);
      });
  }
  connect()