var express = require('express');
var app = express();

// CONTRIBUTED MIDDLEWARE
var serveStatic = require('serve-static');
app.use(serveStatic('public', {'index': ['index.html']}));
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// DATABASE CONNECTION
var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
mongoose.connect('mongodb://localhost/hellodb');

// ROUTES
app.use('/linkedin', require('./server/routes/linkedin'));
app.use('/events', require('./server/routes/events'));
app.use('/channels', require('./server/routes/channels'));
app.use('/scannings', require('./server/routes/scannings'));
app.use('/persons', require('./server/routes/persons'));
app.use('/messages', require('./server/routes/messages'));
app.use('/introductions', require('./server/routes/introductions'));

app.listen(3000);
