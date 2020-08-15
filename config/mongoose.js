const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/codeial_development', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to mongodb"));

db.once('open', function() {
    console.log('connected to database successful');
});

module.exports = db;