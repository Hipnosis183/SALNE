const { Schema, model } = require('mongoose');

const autorSchema = new Schema({
    nombre: { type: String, required: true, maxlength: 50 }
});

autorSchema.virtual('url').get(function () {
    return '/catalogo/autores/' + this._id;
});

module.exports = model('autor', autorSchema);