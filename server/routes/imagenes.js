const express = require('express');

const fs = require('fs');
const path = require('path');

const { verificaTokenImg } = require('../middelwares/autenticacion')

const app = express();


app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    const tipo = req.params.tipo;
    const img = req.params.img;

    const pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    const noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        res.sendFile(noImagePath);
    }
});



module.exports = app;