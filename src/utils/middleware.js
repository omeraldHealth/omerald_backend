const jwt = require('jsonwebtoken');

// Middleware to validate token
exports.authenticateToken = (req, res, next) => {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // if the token is invalid
    req.user = user;
    next();
  });
};
