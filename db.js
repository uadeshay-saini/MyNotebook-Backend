const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://uadeshaysaini:TDeDUkfsGvYB4sHD@cluster0.uiek9c6.mongodb.net/MyNotebook?retryWrites=true&w=majority"

async function connectToMongo() {
    await mongoose.connect(mongoURI).then(()=> console.log("Connected to Mongo Successfully")).catch(err => console.log(err));
  }

module.exports = connectToMongo;
  