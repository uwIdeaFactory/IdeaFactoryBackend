const request = require('supertest');
const app = require('../app'); // import your app.js file

test('Get all users', async () => {
    const response = await request(app).get('/users'); // use app object to make requests
    // console.log(response.body.length >= 1);
    expect(response.statusCode).toBe(200);
    expect(response.body.length >= 1).toBe(true);
});

test('Get all projects', async () => {
    const response = await request(app).get('/projects'); // use app object to make requests
    expect(response.statusCode).toBe(200);
});

afterAll(done => {
    app.close(() => {
      console.log('Server stopped');
      done();
    });
  });
console.log('here');
// close the server after all tests
app.close();
