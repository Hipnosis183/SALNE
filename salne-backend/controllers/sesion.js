var UsuarioModel = require('../models/usuario');

// Crear sesión en la base de datos.
module.exports.apiSesionIniciar = function (req, res, next) {
    if (!req.session.id_usuario) {
        UsuarioModel.findOne({
            'email': req.body.email,
            'password': req.body.password
        }, function (err, usuario) {
            if (err) { return handleError(err); }
            if (usuario) {
                req.session.id_usuario = usuario._id;
                res.sendStatus(200); return;
            } else { res.sendStatus(202); return; }
        });
    }
};

// Combrobar la existencia e integridad de la sesión.
module.exports.apiSesionAutenticar = function (req, res, next) {
    if (req.session.id_usuario) {
        UsuarioModel.findById(req.session.id_usuario, function (err, usuario) {
            if (err) { return handleError(err); }
            if (usuario) {
                // Eliminar contraseña antes de enviar el objeto.
                usuario.password = undefined;
                res.json(usuario); return;
            }
        });
    } else { res.sendStatus(500); return; }
}

// Eliminar la sesión.
module.exports.apiSesionCerrar = function (req, res, next) {
    // Terminar la sesión en el servidor.
    req.session.destroy();
    // Eliminar las cookies en el cliente.
    res.clearCookie('connect.sid');
    res.clearCookie('carrito');
    res.sendStatus(200);
}

// Comprobar si el usuario de la sesión es administrador.
module.exports.reqAdmin = function (req, res, next) {
    if (req.session.id_usuario) {
        UsuarioModel.findById(req.session.id_usuario, function (err, usuario) {
            if (err) { return handleError(err); }
            if (usuario.admin) { next(); }
            else { res.sendStatus(500); return; }
        })
    } else { res.sendStatus(500); return; }
}

// Comprobar si existe una sesión abierta.
module.exports.reqSesion = function (req, res, next) {
    if (req.session.id_usuario) {
        UsuarioModel.findById(req.session.id_usuario, function (err, usuario) {
            if (err) { return handleError(err); }
            if (usuario) { next(); }
            else { res.sendStatus(500); return; }
        })
    } else { res.sendStatus(500); return; }
}

// Imprimir errores en la consola del servidor.
function handleError(err) {
    console.log(err);
}