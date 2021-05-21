const { Schema, model } = require('mongoose');

const libroSchema = new Schema({
    titulo: { type: String, required: true, maxlength: 100 },
    descrip: { type: String, required: true, maxlength: 300 },
    autor: { type: Schema.Types.ObjectId, ref: 'autor', required: true },
    edicion: { type: String, required: true, maxlength: 20 },
    ano: { type: Number, required: true },
    genero: { type: Schema.Types.ObjectId, ref: 'genero', required: true },
    isbn: { type: Number, required: true },
    imagen: { type: String, required: true, maxlength: 30 }
});

libroSchema.set('toObject', { virtuals: true });
libroSchema.set('toJSON', { virtuals: true });

module.exports = model('libro', libroSchema);