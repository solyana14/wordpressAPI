const mongoose = require('mongoose')
const config = require('../config')
mongoose.Promise = global.Promise
mongoose.connect(`mongodb://localhost:27017/${process.env.MONGO_URL}`, { useNewUrlParser: true })
module.exports = mongoose