const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbName = 'simplegame';

module.exports = {
    connect:(callback)=> {

        MongoClient.connect("mongodb+srv://shantanuSimpleGame:shantanu237@cluster0.yk1vf.mongodb.net/test", function (err, client) {
            assert.equal(null, err);
            console.log("Connected successfully to server");
    
            const db = client.db(dbName);
          //  console.log(db)
            // db.collection("match_data").findOne({},(err,res)=>{
            //     console.log(res)
            // })
            return callback(db);
        });
    }
}


