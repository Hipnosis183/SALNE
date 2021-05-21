var LibroModel = require('../models/libro');

module.exports.index = function (req, res, next) {
    res.render('layout', { content: 'index', title: '' });
}

module.exports.catalogo = function (req, res, next) {
    LibroModel.find()
        .populate('autor')
        .populate('genero')
        .exec(function (err, librosLista) {
            if (err) { return next(err); }
            res.render('layout', { content: 'catalogo', title: ' - Catálogo', libros: librosLista });
        });
}