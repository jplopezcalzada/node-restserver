const express = require('express');
const { verificarToken } = require('../middelwares/autenticacion');

let app = express();
const Producto = require('../models/producto');


//=============================
// Mostrar todos los productos
//=============================

app.get('/productos', verificarToken, (req, res) => {
    //trae todos los productos 
    // populate: usuario y categorias
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;

    Producto.find({ disponible: true })
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
            });


        });

});


//==============================
// Mostrar todos producto por ID
//==============================
app.get('/producto/:id', verificarToken, (req, res) => {
    // populate: usuario y categorias
    const id = req.params.id;
    // Catergoria.findById(....)
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no encontrado'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });

});

//==============================
// Buscar productos
//==============================
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {
    // populate: usuario y categorias
    const termino = req.params.termino;
    const regex = new RegExp(termino, 'i');
    // Catergoria.findById(....)
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no encontrado'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });

});


//==============================
// Crear un producto
//==============================
app.post('/producto', verificarToken, (req, res) => {
    const body = req.body;

    const producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id

    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

});

//==============================
// Actualizar un producto
//==============================
app.put('/producto/:id', verificarToken, (req, res) => {
    // grabar usuario
    // grabar categoria del listado
    const body = req.body;
    const id = req.params.id;
    const desProducto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        disponible: body.disponible,
        usuario: req.usuario._id
    };


    Producto.findByIdAndUpdate(id, desProducto, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });


});

//==============================
// Borrar un producto
//==============================
app.delete('/producto/:id', verificarToken, (req, res) => {
    // disponible a false
    const id = req.params.id;
    // cambiando el disponible
    const cambioDisponible = {
        disponible: false
    };

    // Eliminado cambiando el estado
    Producto.findByIdAndUpdate(id, cambioDisponible, { new: true }, (err, productoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            producto: 'Producto eliminado'
        });
    });

});



module.exports = app;