const getHealth = async (req, res) => {
    const serverIP = req.hostname; // Server IP
    const serverPort = req.app.get('port'); // Server Port
    const requestProtocol = req.protocol; // Request Protocol
  
    res.json({ 
      status: 'ok',
      serverIP,
      serverPort,
      requestProtocol
    });
};

module.exports = {
    getHealth,
};
