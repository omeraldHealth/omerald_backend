const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.authenticateAPIUser = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const auth = authHeader.split(' ');
    const credentials = Buffer.from(auth[1], 'base64').toString().split(':');
    const username = credentials[0];
    const password = credentials[1];
    
    if (username === process.env.API_USER) {
      try {
        const validPassword = await bcrypt.compare(password, process.env.API_PASSWORD_HASH);
        if (validPassword) {
          const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET);
          res.json({ accessToken });
        } else {
          res.status(401).send('Password is incorrect');
        }
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      }
    } else {
      res.status(401).send('User not found or Unauthorized access');
    }
  } else {
    res.status(401).send('Authorization header is missing');
  }
};
