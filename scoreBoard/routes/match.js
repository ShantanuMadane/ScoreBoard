var express = require("express");
var router = express.Router();
var mongoClient = require("../database/connection.js");
const validator = require("../utils/validate.js");
const auth = require("../utils/middleware.js");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const saltRounds = 10;

router.get("/", (req, res, next) => {
  res.send("respond with a resource");
});
router.post("/player_score",auth,(req, res, next) => {
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
    return res.send({ status: 400, message: "error in player score" });
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
    console.error(err)
    return res.send({ status: 400, message: "error in player insert" });
  }
});

router.get("/player_stats",auth, (req, res) => {
  try {
    let playerId = req.query.playerId;

    if (!playerId) {
      return res.send({ status: 400, message: "paramter playerId missing" });
    } else {
      //check if player id exits
      // throw "my err"
      mongoClient.connect(db => {
        db.collection("playerData").findOne({ playerId }, (err, data) => {
          if (data) {
            db.collection("match_data")
              .find({ playerId }, { projection: { _id: 0, updatedAt: 0 } })
              .toArray((err, data) => {
                console.log(data);
                // db.close();
                return res.send({ status: 200, playerStats: data });
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
    console.log(err);
    return res.send({ status: 400, message: "error in player stats" });
  }
});

router.get("/match_leaderboard",auth, (req, res) => {
  try {
    console.log("HHHHHH");
    let matchName = req.query.matchName;
    let filter = req.query.filter;
    let isFiltered = false;
    var time;
    if (filter == "NOW-1HR") {
      time = new Date().getTime() - 1 * 1000 * 60 * 60;
      isFiltered = true;
    } else if (filter == "ONE-DAY") {
      time = new Date().getTime() - 1 * 1000 * 60 * 60 * 24;
      isFiltered = true;
    } else {
      isFiltered = false;
    }
    console.log("INSIDE match_leaderboard");
    if (!matchName) {
      return res.send({ status: 400, message: "paramter matchName missing" });
    } else {
      mongoClient.connect(db => {
        if (isFiltered) {
          console.log("IS FILTERED", time);
          db.collection("match_data")
            .find(
              { matchName, updatedAt: { $gte: time } },
              { projection: { _id: 0, updatedAt: 0 } }
            )
            .sort({ score: -1 })
            .toArray((err, data) => {
              if (data) {
                console.log("IN DATA", data);
                for (var i = 0; i < data.length; i++) {
                  data[i]["rank"] = ++i;
                }

                return res.send({ status: 200, stats: data });
              } else {
                return res.send({
                  status: 400,
                  message: "match data does not exist for the match name"
                });
              }
            });
        } else {
          db.collection("match_data")
            .find({ matchName }, { projection: { _id: 0, updatedAt: 0 } })
            .sort({ score: -1 })
            .toArray((err, data) => {
              if (data) {
                for (var i = 0; i < data.length; i++) {
                  data[i]["rank"] = ++i;
                }
                res.send({ status: 200, stats: data });
              } else {
                return res.send({
                  status: 400,
                  message: "match data does not exist for the match name"
                });
              }
            });
        }
      });
    }
  } catch (err) {
    return res.send({ status: 400, message: "error in match leaderboard" });
  }
});

router.get("/player_stats_match",auth, (req, res) => {
  try {
    let matchName = req.query.matchName;
    let filter = req.query.filter;
    let isFiltered = false;
    var time;
    if (filter == "NOW-1HR") {
      time = new Date().getTime() - 1 * 1000 * 60 * 60;
      isFiltered = true;
    } else if (filter == "ONE-DAY") {
      time = new Date().getTime() - 1 * 1000 * 60 * 60 * 24;
      isFiltered = true;
    } else {
      isFiltered = false;
    }
    console.log("INSIDE match_leaderboard");
    if (!matchName) {
      return res.send({ status: 400, message: "parameter matchName missing" });
    } else {
      mongoClient.connect(db => {
        if (isFiltered) {
          console.log("IS FILTERED", time);
          db.collection("match_data")
            .find(
              { matchName, updatedAt: { $gte: time } },
              { projection: { _id: 0, updatedAt: 0 } }
            )
            .sort({ score: -1 })
            .toArray((err, data) => {
              if (data) {
                console.log("IN DATA", data);

                return res.send({ status: 200, player_stats_match: data });
              } else {
                return res.send({
                  status: 400,
                  message: "match data does not exist for the match name"
                });
              }
            });
        } else {
          db.collection("match_data")
            .find({ matchName }, { projection: { _id: 0, updatedAt: 0 } })
            .sort({ score: -1 })
            .toArray((err, data) => {
              if (data) {
                res.send({ status: 200, player_stats_match: data });
              } else {
                return res.send({
                  status: 400,
                  message: "match data does not exist for the match name"
                });
              }
            });
        }
      });
    }
  } catch (err) {
    return res.send({ status: 400, message: "error in player match stats" });
  }
});

router.post("/player_register", (req, res) => {
  try {
    const email = req.body.email;
    const pass = req.body.password;
    const userName = req.body.userName;
    console.log("HERE");

    let requestMethod = req.method;
    console.log(requestMethod);
    if (!email || !pass || !userName) {
      return res.send({
        status: 400,
        message: "parameter email, password or userName  missing"
      });
    }
    if (!validator.validateEmail(email)) {
      return res.send({ status: 400, message: "invalid email id" });
    }

    console.log("AVSBASVABSC")
    bcrypt.hash(pass, saltRounds, (err, hash) => {
      // Store hash in your password DB.
      console.log(hash, typeof hash);
      mongoClient.connect(db => {
        // check if the email already exists
        db.collection("playerData").findOne({ email: email }, (err, data) => {
          if (data) {
            return res.send({ status: 400, message: "player with the given email id already exists" })
          } else if (err) {
            console.error("error", err)
            return res.send({ status: 400, message: "error in player registration " })
          } else {
            let playerId = shortid.generate();
            db.collection("playerData").insert(
              { userName, playerId, password: hash, email },
              (err, data) => {
                if (!err) {
                  return res.send({
                    status: 200,
                    message: "new player registered successfully"
                  });
                }
              }
            );
          }
        });
      });
    });
  } catch (err) {
    console.error("ASGHASHGAS", err)
    return res.send({ status: 400, message: "error in player registration " })
  }
});

router.post("/player_login", (req, res) => {
  try {
    const email = req.body.email;
    const pass = req.body.password;

    if (!email || !pass) {
      return res.send({
        status: 400,
        message: "parameter email or password missing"
      });
    }
    mongoClient.connect(db => {
      db.collection("playerData").findOne({ email: email }, (err, data) => {
        if (!err) {
          if (data) {
            bcrypt.compare(pass, data.password, (err, result) => {
              // result == true
              if (result == true) {
               // console.log("PRIVATE KEY", process.env.JWT_KEY);
               // console.log(process.cwd())
                const privateKey = fs.readFileSync("./deploy/local/private.pem");
                //  var token = jwt.sign({email },privateKey, { algorithm: 'RS256'});
                // console.log("TOKEN",token)
                jwt.sign({ email: email }, privateKey, { algorithm: 'RS256', expiresIn: '1h' }, (err, token) => {
                  if (token) {
                    console.log(token);
                    // const data = jwt.verify(token, privateKey);
                    // console.log("VERIFICATION",data)
                    // console.log("PLAYERID",data.playerId)
                    return res.send({ status: 200, message: "login successfull", playerId: data.playerId, token });
                  } else {
                    console.error("error in jwt token", err);
                    return res.send({ status: 400, message: "authorization failed" });
                  }
                });
              } else {
                return res.send({ status: 400, message: "authorization failed" });
              }
            });
          } else {
            return res.send({ status: 400, message: "no data found for the email id provided" });
          }
        } else {
          return res.send({ status: 400, message: "error in player login" })
        }
      });
    });
  } catch (err) {
    console.error("error in player_login", error);
    return res.send({ status: 400, message: "error in player login" })
  }
})

module.exports = router;
