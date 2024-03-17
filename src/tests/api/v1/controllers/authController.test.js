const request = require('supertest');
const app = require('../../../../../server'); // Import your Express app
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Mock environment variables
process.env.API_USER = 'testuser';
process.env.API_PASSWORD_HASH = bcrypt.hashSync('testpassword', 10);
process.env.ACCESS_TOKEN_SECRET = 'secret';

describe('authenticateAPIUser E2E Test', () => {
  beforeAll(async () => {
    // Connect to MongoDB before running tests
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    // Disconnect from MongoDB after all tests are done
    await mongoose.disconnect();
  });

//   it('should return an access token for valid credentials', async () => {
//     const response = await request(app)
//     .post('/api/v1/auth/getAuthToken')
//     .set('Authorization', 'Basic ' + btoa('omerald_admin:omerald_admin_2024'));

//     expect(response.status).toBe(200);
//     expect(response.body.accessToken).toBeTruthy();
  
//     // Verify the JWT token
//     const decodedToken = jwt.verify(response.body.accessToken, process.env.ACCESS_TOKEN_SECRET);
//     expect(decodedToken.username).toBe('omerald_admin');
//   });
  

  it('should return 401 for invalid credentials', async () => {
    const authHeader = Buffer.from('testuser:wrongpassword').toString('base64');
    const response = await request(app)
      .post('/api/v1/auth/getAuthToken')
      .set('Authorization', `Basic ${authHeader}`);

    expect(response.status).toBe(401);
    expect(response.text).toBe('Password is incorrect');
  });

});
