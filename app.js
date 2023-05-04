const express = require('express')
const cors = require('cors');
const { connectToDb, getDb, closeDb } = require('./db/db')
const {ObjectId } = require('mongodb');

// initialize app
const app = express()

app.use(express.json());
app.use(cors());

// listening port 3000
const server = app.listen(3000, () => {
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
    // let result = await db.collection('Projects').find().toArray();
    // res.json(result);
    let result = []
    db.collection('Projects')
        .find()
        .forEach(project => result.push(project))
        .then(() => {
            console.log('successful')
            res.status(200).json(result)
        }).then(closeDb)
        .catch(() => {
            console.log('err')
            res.status(500).json({err: 'server error: failed to get all projects'})
        })
})

// api to post project
app.post('/post', connect, async (req, res) => {
    let newProject = {};
    console.log(req);
    newProject.pname = req.body.pname;

    newProject.preview = req.body.preview;
    newProject.detail = req.body.detail;
    // missing tag, roles, contact for now
    newProject.owner = req.body.owner;
    newProject.location = req.body.location;
    
    await db.collection('Projects').insertOne(newProject);
    res.send('posted');
})

// api to remove project
// **IMPORTANT: change app.get() to other http request**
app.get('/delete/:id', connect, async (req, res) => {
    try {
        let id = new ObjectId(req.params.id);
        // let projectFilter = {};
        // projectFilter._id = id;
        await db.collection('Projects').deleteOne({ "_id" : id });
        res.send('removed')
    } catch(err) {
        res.type("text").status(500);
        res.send("server error: cannot delete the project with id: " + req.params.id);
    } finally {
        closeDb;
    }
})

// api to provide detailed info for a specific project
app.get('/projects/:id', connect, async (req, res) => {
    try {
        // console.log("searching for objectid = " + req.params.id);
        let id = new ObjectId(req.params.id);
        let projectFilter = {};
        projectFilter._id = id;

        let result = await db.collection('Projects').findOne(projectFilter);
        res.json(result);
    } catch(err) {
        res.type("text").status(500);
        res.send("server error: cannot get info for the project with id: " + req.params.id);
    } finally {
        closeDb;
    }
})

module.exports = app;
