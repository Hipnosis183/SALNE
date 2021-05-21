// Definir módulos.
var express = require('express');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var cors = require('cors');
require('dotenv').config()
var fileUpload = require('express-fileupload');
var session = require('express-session');
var logger = require('morgan');
var path = require('path');

// Definir y configurar MongoDB y Mongoose.
var MongoStore = require('connect-mongo');
var mongoose = require('mongoose');
var mongoDB = process.env.MONGO_LOCAL;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Configurar módulos.
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({origin: [process.env.CORS_ORIGIN], credentials: true}));
app.use(fileUpload());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Configurar Express-Session y Connect Mongo.
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoDB }),
    cookie: { sameSite: true }
}));

// Definir y configurar rutas.
var ApiRouter = require('./routes/api');
app.use('/api', ApiRouter);

module.exports = app;
