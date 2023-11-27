const mongoose = require('mongoose');
const mongoURI = "mongodb://0.0.0.0:27017/inotebook?readPreference=primary&directConnection=true&tls=false"

async function connectToMongo() {
    await mongoose.connect(mongoURI).then(()=> console.log("Connected to Mongo Successfully")).catch(err => console.log(err));
  }

module.exports = connectToMongo;
  