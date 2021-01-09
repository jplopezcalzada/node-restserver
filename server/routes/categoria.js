const express = require('express');
// const _ = require('underscore');

const { verificarToken, verificaAdmin_Role } = require('../middelwares/autenticacion');

let app = express();
const Categoria = require('../models/categoria');

//=============================
// Mostrar todas las Categorias
//=============================
app.get('/categoria', verificarToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            });


        });
});


//=============================
// Mostrar una Categoria por ID
//=============================
app.get('/categoria/:id', verificarToken, (req, res) => {
    const id = req.params.id;
    // Catergoria.findById(....)
    Categoria.findById(id)
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no encontrado'
                    }
                });
            }
            res.json({
                ok: true,
                categoria: categoriaDB
            });
        });


});

//=============================
// Crear una Categoria 
//=============================
app.post('/categoria', verificarToken, (req, res) => {
    // regresa la nueva categoria

    const body = req.body;

    const categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//=============================
// Actualizar una Categoria 
//=============================
app.put('/categoria/:id', verificarToken, (req, res) => {
    const id = req.params.id;
    const desCategoria = {
        descripcion: req.body.descripcion
    };


    Categoria.findByIdAndUpdate(id, desCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            caterogira: categoriaDB
        });
    });
});


//=============================
// Borrar una Categoria 
//=============================
app.delete('/categoria/:id', [verificarToken, verificaAdmin_Role], (req, res) => {
    // Solo un administrador puede borrar categorias
    const id = req.params.id;
    // Eliminado fisicamente
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            categoria: 'Categoria Borrada'
        });
    });
});


module.exports = app;