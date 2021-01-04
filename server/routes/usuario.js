const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');


const Usuario = require('../models/usuario');
const { verificarToken, verificaAdmin_Role } = require('../middelwares/autenticacion');

const app = express();



app.get('/usuario', verificarToken, (req, res) => {

    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;

    Usuario.find({ estado: true }, 'nombre role estado google email')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });


        });

});
app.post('/usuario', [verificarToken, verificaAdmin_Role], (req, res) => {
    const body = req.body;

    const usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


});
app.put('/usuario/:id', [verificarToken, verificaAdmin_Role], (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});
app.delete('/usuario/:id', [verificarToken, verificaAdmin_Role], (req, res) => {
    const id = req.params.id;
    // cambiando el estado
    const cambioEstado = {
        estado: false
    };
    // Eliminado fisicamente
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    // Eliminado cambiando el estado
    Usuario.findByIdAndUpdate(id, cambioEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});


module.exports = app;