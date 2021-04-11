const { Schema, model } = require('mongoose');

const libroSchema = new Schema({
    titulo: { type: String, required: true, maxlength: 100 },
    descrip: { type: String, required: true, maxlength: 300 },
    autor: { type: Schema.Types.ObjectId, ref: 'autor', required: true },
    edicion: { type: String, required: true, maxlength: 20 },
    año: { type: Number, required: true },
    genero: [{ type: Schema.Types.ObjectId, ref: 'genero', required: true }],
    isbn: { type: Number, required: true },
    formato: { type: String, required: false, maxlength: 4 }
});

libroSchema.virtual('url').get(function () {
    return '/catalogo/libros/' + this._id;
});
libroSchema.virtual('imagen').get(function () {
    return this._id + '.' + this.formato;
});

module.exports = model('libro', libroSchema);