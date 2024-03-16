const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.authenticateAPIUser = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).send('Authorization header is missing');
    }

    const auth = authHeader.split(' ');
    if (auth.length !== 2 || auth[0] !== 'Basic') {
      return res.status(401).send('Invalid authorization format');
    }

    const credentials = Buffer.from(auth[1], 'base64').toString().split(':');
    if (credentials.length !== 2) {
      return res.status(401).send('Invalid credentials format');
    }

    const username = credentials[0];
    const password = credentials[1];
    if (username !== process.env.API_USER) {
      return res.status(401).send('User not found or Unauthorized access');
    }

    const validPassword = await bcrypt.compare(password, process.env.API_PASSWORD_HASH);
    if (!validPassword) {
      return res.status(401).send('Password is incorrect');
    }

    const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};
