const express = require('express');
const fileUpload = require('express-fileupload');
const uniqid = require('uniqid');

const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const app = express();

// default options
//app.use(fileUpload());
app.use(fileUpload(
    // Se usa directorio temporal.
    { useTempFiles: true }
));

app.put('/upload/:tipo/:id', (req, res) => {
    const tipo = req.params.tipo;
    const id = req.params.id;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            message: 'No se ha seleccionado ningun archivo'
        });
    }
    // Validar tipo
    const tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validos son' + tiposValidos.json(','),
                ext: tipo
            }
        });
    }

    const archivo = req.files.archivo;
    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];
    // Extensiones permitidas
    const extesionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extesionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitas son' + extesionesValidas.json(','),
                ext: extension
            }
        });
    }
    // Cambiar el nombre del archivo
    const nombreArchivo = uniqid(`${id}-`) + `.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        // Aqui la imagen esta cargada
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);

        } else {
            imagenProducto(id, res, nombreArchivo);
        }

    });

});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID usuario no encontrado'
                }
            });
        }
        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                borraArchivo(usuarioDB.img, 'usuarios');
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });

    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, prodcutoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!prodcutoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID producto no encontrado'
                }
            });
        }
        borraArchivo(prodcutoDB.img, 'productos');

        prodcutoDB.img = nombreArchivo;
        prodcutoDB.save((err, productoGuardado) => {
            if (err) {
                borraArchivo(prodcutoDB.img, 'productos');
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo
            });
        });

    });
}

function borraArchivo(nombreIamgen, tipo) {
    const pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreIamgen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}
module.exports = app;