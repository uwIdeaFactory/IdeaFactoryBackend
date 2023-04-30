const express = require('express')
const cors = require('cors');
const { connectToDb, getDb, closeDb } = require('./db/db')

// initialize app
const app = express()
// app.listen(3000, '192.168.1.100', () => {
//     console.log('app listening on port 3000')
// })

app.use(cors());

// // listening port 3000
app.listen(3000, () => {
    console.log('app listening on port 3000')
})

// database object
let db

//db connection function (use as middle ware for API that requires database access)
function connect(req, res, next) {
    connectToDb((err) => {
        if (!err) {
            db = getDb()
            next()
        }
    });
}

// sample route
app.get('/', (req, res) => {
    res.send('sample route');
});

// sample route to fetch stuff from user collection
app.get('/users', connect, (req, res) => {
    let result = []
    db.collection('Users')
        .find()
        .forEach(user => result.push(user))
        .then(() => {
            console.log('successful')
            res.status(200).json(result)
        }).then(closeDb)
        .catch(() => {
            console.log('err')
            res.status(500).json({err: '123'})
        })
})

// projects

// api to get all the projects
app.get('/projects', connect, async (req, res) => {
    let result = await db.collection('Projects').find().toArray();
    res.json(result);
})

// api to post project
app.post('/post', connect, async (req, res) => {
    let newProject = {};
    newProject.pname = req.body.pname;
    newProject.preview = req.body.preview;
    newProject.detail = req.body.detail;
    // missing tag, roles, contact for now
    newProject.owner = req.body.owner;
})
