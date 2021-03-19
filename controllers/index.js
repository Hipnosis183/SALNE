var async = require('async');

var AutorModel = require('../models/autor');
var GeneroModel = require('../models/genero');
var LibroModel = require('../models/libro');

module.exports.index = function (req, res, next) {
    res.render('layout', { content: 'index', title: '' });
}

module.exports.catalogo = function (req, res, next) {
    async.parallel({
        autores: function (callback) {
            AutorModel.countDocuments({}, callback); },
        generos: function (callback) {
            GeneroModel.countDocuments({}, callback); },
        libros: function (callback) {
            LibroModel.countDocuments({}, callback); },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('layout', { content: 'catalogo', title: ' - Catálogo', informacion: results });
    });
}