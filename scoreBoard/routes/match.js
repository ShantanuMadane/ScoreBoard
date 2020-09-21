var express = require("express");
var router = express.Router();
var mongoClient = require("../database/connection.js");
const shortid = require("shortid");

router.get("/", (req, res, next) => {
  res.send("respond with a resource");
});

router.post("/player_score", (req, res, next) => {
  try {
    let matchName = JSON.parse(req.body.matchName);
    let playerId = req.body.playerId;
    let kills = parseInt(req.body.kills, 10);
    let score = parseInt(req.body.score, 10);

    if (!playerId) {
      return res.send({ status: 400, message: "paramter playerId missing" });
    }
    if (!matchName) {
      return res.send({ status: 400, message: "paramter matchName missing" });
    }
    console.log(typeof playerId, playerId);
    if (
      typeof playerId != "string" ||
      typeof kills != "number" ||
      typeof score != "number"
    ) {
      return res.send({
        status: 400,
        message: "invalid playerId or kills or score"
      });
    }

   // console.log(mongoClient);
    mongoClient.connect(db => {
      db.collection("playerData").findOne({ playerId }, (err, data) => {
        if (data) {
          console.log("INSIDE IF");
          console.log(data);
          const userName = data.userName;
          db.collection("match_data").update(
            { matchName, playerId },
            {
              $set: { score, kills, userName, updatedAt: new Date().getTime() }
            },
            { upsert: true },
            (err, data) => {
              if (!err) {
                return res.send({
                  status: 200,
                  message: "data insertion successfull"
                });
              } else {
                return res.send({
                  status: 400,
                  message: "data insertion failed"
                });
              }
            }
          );
        } else {
          console.log("INSIDE ELSE");
          console.log(err);
          return res.send({
            status: 400,
            message:
              "data does not exist in playerData collection for the given playerId"
          });
        }
      });
    });
  } catch (err) {
    return res.send({ status: 400, message: " query failed" });
  }
});
router.post("/player_data_insert", (req, res, next) => {
  try {
    let userName = req.body.userName;
    let playerId = shortid.generate();

    if (!userName) {
      return res.send({ status: 400, message: "paramter userName missing" });
    }

    console.log(mongoClient);
    mongoClient.connect(db => {
      db.collection("playerData").insert(
        { userName, playerId },
        (err, data) => {
          if (!err) {
            return res.send({
              status: 200,
              message: "new player added successfully"
            });
          }
        }
      );
    });
  } catch (err) {
    return res.send({ status: 400, message: " query failed" });
  }
});

router.get("/player_stats", (req, res) => {
  try {
    let playerId = req.query.playerId;

    if (!playerId) {
      return res.send({ status: 400, message: "paramter playerId missing" });
    } else {
      //check if player id exits

      mongoClient.connect(db => {
        db.collection("playerData").findOne({ playerId }, (err, data) => {
          if (data) {
            db.collection("match_data").find({ playerId },{projection:{ "_id" : 0, "updatedAt" : 0}}).toArray( (err, data) => { 
              console.log(data);
              db.close();
              return res.send({status:200,playerStats:data});
            });
          } else {
            return res.send({
              status: 400,
              message:
                "invalid playerId or player not registered in player data"
            });
          }
        });
      });
    }
  } catch (err) {
    return res.send({ status: 400, message: " query failed" });
  }
});

router.get("/match_leaderboard", (req, res) => {
  try {
    console.log("HHHHHH")
    let matchName = req.query.matchName;
    let filter = req.query.filter;
    let isFiltered = false
    var time;
    if(filter == "NOW-1HR"){
       time = new Date().getTime() - 1 * 1000*60*60;
       isFiltered =true;
    }else if(filter == "ONE-DAY"){
      time = new Date().getTime() - 1 * 1000*60*60 * 24;  
      isFiltered =true;
    }else{
      isFiltered =false;
    }
    console.log("INSIDE match_leaderboard");
    if (!matchName) {
      return res.send({ status: 400, message: "paramter matchName missing" });
    } else {
      mongoClient.connect(db => {
        if(isFiltered){
          console.log("IS FILTERED",time)
        db.collection("match_data").find({ matchName,updatedAt:{$gte:time}},{projection:{_id:0,updatedAt:0}}).sort({score:-1}).toArray((err,data)=>{
          if(data){
            console.log("IN DATA",data)
           for(var i=0;i<data.length;i++){
             data[i]["rank"] = ++i;
           }
           
          return res.send({status:200,stats:data});
          }else{
            return res.send({
              status: 400,
              message:
                "match data does not exist for the match name"
            });
          }
        });
      }else{
        db.collection("match_data").find({ matchName},{projection:{_id:0,updatedAt:0}}).sort({score:-1}).toArray((err,data)=>{
          if(data){
           for(var i=0;i<data.length;i++){
             data[i]["rank"] = ++i;
           }
           res.send({status:200,stats:data});
          }else{
            return res.send({
              status: 400,
              message:
                "match data does not exist for the match name"
            });
          }
        });
      }
      });
    }

  } catch (err) {
    return res.send({ status: 400, message: " query failed" });
  }
});

router.get("/player_stats_match",(req,res)=>{
  try{
    let matchName =req.query.matchName;
    let filter = req.query.filter;
    let isFiltered = false
    var time;
    if(filter == "NOW-1HR"){
       time = new Date().getTime() - 1 * 1000*60*60;
       isFiltered =true;
    }else if(filter == "ONE-DAY"){
      time = new Date().getTime() - 1 * 1000*60*60 * 24;  
      isFiltered =true;
    }else{
      isFiltered =false;
    }
    console.log("INSIDE match_leaderboard");
    if (!matchName) {
      return res.send({ status: 400, message: "parameter matchName missing" });
    } else {
      mongoClient.connect(db => {
        if(isFiltered){
          console.log("IS FILTERED",time)
        db.collection("match_data").find({ matchName,updatedAt:{$gte:time}},{projection:{_id:0,updatedAt:0}}).sort({score:-1}).toArray((err,data)=>{
          if(data){
            console.log("IN DATA",data)
         
          return res.send({status:200,player_stats_match:data});
          }else{
            return res.send({
              status: 400,
              message:
                "match data does not exist for the match name"
            });
          }
        });
      }else{
        db.collection("match_data").find({ matchName},{projection:{_id:0,updatedAt:0}}).sort({score:-1}).toArray((err,data)=>{
          if(data){
           res.send({status:200,player_stats_match:data});
          }else{
            return res.send({
              status: 400,
              message:
                "match data does not exist for the match name"
            });
          }
        });
      }
      });

    }

  }catch(err){

  }
})

module.exports = router;
