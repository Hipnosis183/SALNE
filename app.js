var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var nunjucks = require('express-nunjucks');
var session = require('express-session');
var MongoStore = require('connect-mongo');
var fileUpload = require('express-fileupload');

var AutoresRouter = require('./routes/autores');
var GenerosRouter = require('./routes/generos');
var IndexRouter = require('./routes/index');
var LibrosRouter = require('./routes/libros');
var UsuariosRouter = require('./routes/usuarios');
var SesionRouter = require('./routes/sesion');

var app = express();
nunjucks(app, {});

var mongoose = require('mongoose');
// var mongoDB = 'mongodb://127.0.0.1/libreria';
var mongoDB = 'mongodb+srv://user:user@cluster.a2fao.mongodb.net/libreria?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

var UsuarioModel = require('./models/usuario');

app.use(session({
    secret: '55aMKLU$%kZ3iDa$YSV4Hk4XN!7wik',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoDB })
}));
app.use(function (req, res, next) {
    res.locals.session = req.session;
    if (res.locals.session.usuarioId) {
        UsuarioModel.findOne({ '_id': res.locals.session.usuarioId }, function (err, usuario) {
            if (err) { return next(err); }
            res.locals.usuario = usuario;
        });
    } next();
});

app.use('/', IndexRouter);
app.use('/catalogo/autores', AutoresRouter);
app.use('/catalogo/generos', GenerosRouter);
app.use('/catalogo/libros', LibrosRouter);
app.use('/usuarios', UsuariosRouter);
app.use('/', SesionRouter);

module.exports = app;
