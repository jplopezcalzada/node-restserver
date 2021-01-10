const { json } = require('body-parser');
const jwt = require('jsonwebtoken');

//========================
// Verificar Token
//========================

const verificarToken = (req, res, next) => {
    const token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });


};
//========================
// Verificar Admin_Role
//========================

const verificaAdmin_Role = (req, res, next) => {
    const usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }



};
//============================
// Verificar token para imagen
//============================

const verificaTokenImg = (req, res, next) => {
    const token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });



};
module.exports = {
    verificarToken,
    verificaAdmin_Role,
    verificaTokenImg
};