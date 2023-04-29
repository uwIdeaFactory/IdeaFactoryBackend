const { MongoClient } = require('mongodb')
const {DBNAME, DBUSER, DBPASSWORD} = require('./config')

let dbConnection
// username & password: ideafactory
let uri = `mongodb+srv://${DBUSER}:${DBPASSWORD}@cluster0.y6ysia6.mongodb.net/${DBNAME}?retryWrites=true&w=majority`

module.exports = {
    // connect to database
    connectToDb: (cb) => {
      MongoClient.connect(uri)
        .then((dbClient) => {
          console.log('Connected to database')
          client = dbClient
          return cb()
        })
        .catch((err) => {
          console.log('Error connecting to database', err)
          return cb(err)
        })
    },
    //get database object
    getDb: () => client.db(),
    //close database connection
    closeDb: () => {
      if (client) {
        client.close()
          .then(() => console.log('Connection to database closed'))
          .catch((err) => console.log('Error closing connection to database', err))
      }
    }
  }
  
  
  
  
  
  
  
