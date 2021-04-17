const { Schema, model } = require('mongoose');

const usuarioSchema = new Schema({
    nombre: { type: String, required: true, maxlength: 50 },
    password: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, maxlength: 100 },
    admin: { type: Boolean, required: true },
    libros: [{ type: Schema.Types.ObjectId, ref: 'libro' }]
});

usuarioSchema.virtual('url').get(function () {
    return '/usuarios/' + this._id;
});

module.exports = model('usuario', usuarioSchema);