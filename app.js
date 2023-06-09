const express = require('express')
const cors = require('cors');
const { connectToDb, getDb, closeDb } = require('./db/db')
const { ObjectId } = require('mongodb');

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

// User APIs

// api to create a new user
app.post('/user/create', connect, async (req, res) => {
    try {
        let newUser = {};
        newUser.uid = req.body.uid;
        newUser.attend = [];
        newUser.host = [];
        await db.collection('Users').insertOne(newUser);
        res.send('create user successful');
    } catch {
        res.type("text").status(500);
        res.send("server error.");
    } finally {
        closeDb();
    }
})

// api to update user's info
app.post('/patchBasicInfo/:uid', connect, async (req, res) => {
    try {
        let uid = req.params.uid;
        let username = req.body.username;
        let contact = req.body.contact;
        let location = req.body.location;
        let summary = req.body.summary;
        let resume = req.body.resume;
        let result = await db.collection('Users').updateOne(
            { uid: uid },
            { $set: { username: username, contact: contact, location: location, bio: summary, resume: resume } }
        );
        res.json(result);
    } catch (err) {
        res.type("text").status(500);
        res.send("server error.");
    } finally {
        closeDb();
    }
})

// api to update user's joined projects
app.post('/update/attend', connect, async (req, res) => {
    try {
        let uid = req.body.uid;
        let newAttend = req.body.attend;
        let result = await db.collection('Users').updateOne(
            { uid: uid },
            { $push: { attend: newAttend } }
        );
        res.json(result);
    } catch (err) {
        res.type("text").status(500);
        res.send("server error.");
    } finally {
        closeDb();
    }
});

// api to get a specific user by uid
app.get('/user/:uid', connect, async (req, res) => {
    try {
        let uid = req.params.uid;
        let userFilter = {};
        userFilter.uid = uid;
        let result = await db.collection('Users').findOne(userFilter);
        res.json(result);
    } catch (err) {
        res.type("text").status(500);
        res.send("server error.");
    } finally {
        closeDb();
    }
})

// Project APIs

// api to get all the projects
app.get('/projects', connect, async (req, res) => {
    // let result = await db.collection('Projects').find().toArray();
    // res.json(result);
    const { page, pageSize } = req.query;
    try {
        const skip = (parseInt(page) - 1) * parseInt(pageSize);
        const limit = parseInt(pageSize);
        let result = await db.collection('Projects').find().skip(skip).limit(limit).toArray();
        res.json(result);
    } catch (err) {
        res.type("text").status(500);
        res.send("server error.");
    } finally {
        closeDb();
    }
})

// api to get a specific project
app.get('/project/:id', connect, async (req, res) => {
    try {
        let id = new ObjectId(req.params.id);
        let projectFilter = {};
        projectFilter._id = id;

        let result = await db.collection('Projects').findOne(projectFilter);
        res.json(result);
    } catch (err) {
        res.type("text").status(500);
        res.send("server error: cannot get info for the project with id: " + req.params.id);
    } finally {
        closeDb();
    }
})

app.post('/post', connect, async (req, res) => {
    try {
        const newProject = {
            pname: req.body.pname,
            contact: req.body.contact,
            preview: req.body.preview,
            detail: req.body.detail,
            owner: req.body.owner,
            location: req.body.location,
            roles: req.body.roles,
        };

        const { insertedId } = await db.collection('Projects').insertOne(newProject);

        const pid = insertedId.toString(); // Convert ObjectId to string

        let uid = req.body.owner;
        let newHost = pid;
        await db.collection('Users').updateOne(
            { uid: uid },
            { $push: { host: newHost } }
        );

        res.json({ id: pid });
    } catch (error) {
        console.error('Error posting project:', error);
        res.status(500).json({ error: 'Failed to post project.' });
    } finally {
        closeDb();
    }
});


// api to update project
app.post('/update/project', connect, async (req, res) => {
    try {
        let id = new ObjectId(req.body.id);
        let projectFilter = {};
        projectFilter._id = id;
        let update = {};
        update.pname = req.body.pname;
        update.preview = req.body.preview;
        update.detail = req.body.detail;
        update.owner = req.body.owner;
        update.location = req.body.location;
        update.roles = req.body.roles;

        await db.collection('Projects').updateOne(projectFilter, { $set: update });
        res.send('updated');
    } catch (err) {
        res.type("text").status(500);
        res.send("server error: cannot update the project with id: " + req.body.id);
    } finally {
        closeDb();
    }
});

// api to remove project
// **IMPORTANT: change app.get() to other http request**
app.get('/delete/:id', connect, async (req, res) => {
    try {
        let id = new ObjectId(req.params.id);
        // let projectFilter = {};
        // projectFilter._id = id;
        await db.collection('Projects').deleteOne({ "_id": id });
        res.send('removed')
    } catch (err) {
        res.type("text").status(500);
        res.send("server error: cannot delete the project with id: " + req.params.id);
    } finally {
        closeDb();
    }
})

app.get('/projects/:text', connect, async (req, res) => {
    const { page, pageSize } = req.query;
    const searchText = req.params.text;
    try {
        const skip = (parseInt(page) - 1) * parseInt(pageSize);
        const limit = parseInt(pageSize);
        const query = { pname: { $regex: searchText, $options: 'i' } };
        let result = await db
            .collection('Projects')
            .find(query) // Add text search filter
            .skip(skip)
            .limit(limit)
            .toArray();
        res.json(result);
    } catch (err) {
        res.type('text').status(500);
        res.send('server error search.');
    } finally {
        closeDb();
    }
});

// get count of projects
app.get('/projects/count', connect, async (req, res) => {
    try {
        let result = await db.collection('Projects').countDocuments();
        res.json(result);
    } catch (err) {
        res.type("text").status(500);
        res.send("server error: cannot get count of projects");
    } finally {
        closeDb();
    }
})


module.exports = app;
module.exports = server;
