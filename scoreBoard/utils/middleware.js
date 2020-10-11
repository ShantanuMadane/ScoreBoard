const jwt = require("jsonwebtoken");
const fs =require("fs");
var mongoClient = require("../database/connection.js");

const auth = async (req, res, next) => {
    try {
        console.log("AUTH CALLED")
        const token = req.header("Authorization").replace("Bearer ", "");
        const privateKey = fs.readFileSync("./deploy/local/private.pem");
        const data = jwt.verify(token, privateKey);
        console.log("VERIFY TOKEN DATA",data);
        mongoClient.connect(db => {
            db.collection("playerData").findOne({ email:data.email }, (err, data) => {
                if (err) {
                    return res.status(401).send({ error: "error in middleware authentication" });
                } else if (!data) {
                    throw new Error();
                }
                next();
            });
        });
    } catch (error) {
        console.error(error);
        res.status(401).send({ error: "Not authorized to access this resource" });
    }
};
module.exports = auth;
