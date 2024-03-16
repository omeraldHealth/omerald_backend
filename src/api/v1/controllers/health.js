const getHealth = async (req, res) => {
  try {
      const serverIP = req.hostname; // Server IP
      const serverPort = req.app.get('port'); // Server Port
      const requestProtocol = req.protocol; // Request Protocol

      res.json({ 
        status: 'ok',
        serverIP,
        serverPort,
        requestProtocol
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getHealth,
};
