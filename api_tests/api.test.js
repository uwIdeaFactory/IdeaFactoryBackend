const request = require('supertest');
const app = require('../app');
const server = require('../app');

// test get all projects
test('Get all projects', async () => {
const response = await request(app).get('/projects');
expect(response.statusCode).toBe(200);
expect(response.body.length >= 1).toBe(true);
});

// test get count of projects
test('Get count of projects', async () => {
const response = await request(app).get('/projects/count');
expect(response.statusCode).toBe(200);
// expect(typeof response.body).toBe('number');
});

// // test create user
// test('Create user', async () => {
// const response = await request(app)
// .post('/user/create')
// .send({ uid: '123' });
// expect(response.statusCode).toBe(200);
// expect(response.text).toBe('create user successful');
// });

// test get user by uid
test('Get user by uid', async () => {
const response = await request(app).get('/user/oDRuTU8c0yQOb8nu3bOKqsEGoqk1');
expect(response.statusCode).toBe(200);
expect(response.body.uid).toBe('oDRuTU8c0yQOb8nu3bOKqsEGoqk1');
});

// test get all projects with pagination
test('Get all projects with pagination', async () => {
const response = await request(app)
.get('/projects')
.query({ page: 1, pageSize: 10 });
expect(response.statusCode).toBe(200);
expect(response.body.length >= 1).toBe(true);
});

// test get project by id
test('Get project by id', async () => {
const response = await request(app).get('/project/646180e054865bd7d0183221');
expect(response.statusCode).toBe(200);
expect(response.body._id).toBe('646180e054865bd7d0183221');
});

// // test post project
// test('Post project', async () => {
// const response = await request(app)
// .post('/post')
// .send({
// pname: 'test project',
// preview: 'test preview',
// detail: 'test detail',
// owner: 'test owner',
// location: 'test location',
// });
// expect(response.statusCode).toBe(200);
// expect(response.text).toBe('posted');
// });

// // test delete project
// test('Delete project', async () => {
// const response = await request(app).delete('/delete/123456789012345678901234');
// expect(response.statusCode).toBe(200);
// expect(response.text).toBe('deleted');
// });

afterAll(done => {
    console.log('Closing server');
    server.close(() => {
        console.log('Server stopped');
        done();
    });
    console.log('Server stopped1');
});
