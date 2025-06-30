
require('dotenv').config()
const { mongoose } = require("mongoose")
const Connection = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Succesfully connected to database");
}

module.exports = Connection
