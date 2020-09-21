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
            db.collection("match_data").find({ playerId },{ "_id" : 0, "updatedAt" : 0}).toArray( (err, data) => { 
              console.log(data);
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

module.exports = router;
