const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) throw new Error("Token is missing");
  if (authHeader && authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];
    jwt.verify(
        token, 
        `${process.env.ACCESS_TOKEN_SECERT}`, 
        (err, decoded) => {
            if (err) {
                res.status(403);
                // console.log(err)
                throw new Error(`Invalid Token`);
            }
            req.user = decoded.user;
            next();
        });
  }
};

module.exports = verifyToken;
