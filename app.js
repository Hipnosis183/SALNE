var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var nunjucks = require('express-nunjucks');

var AutoresRouter = require('./routes/autores');
var GenerosRouter = require('./routes/generos');
var IndexRouter = require('./routes/index');
var LibrosRouter = require('./routes/libros');

var app = express();
nunjucks(app, {});

var mongoose = require('mongoose');
// var mongoDB = 'mongodb://127.0.0.1/libreria';
var mongoDB = 'mongodb+srv://user:user@cluster.a2fao.mongodb.net/libreria?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', IndexRouter);
app.use('/catalogo/autores', AutoresRouter);
app.use('/catalogo/generos', GenerosRouter);
app.use('/catalogo/libros', LibrosRouter);

module.exports = app;
