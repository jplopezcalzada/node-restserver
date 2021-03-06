// =======================
// Puerto
// =======================

process.env.PORT = process.env.PORT || 3000;



// =======================
// Entorno
// =======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =======================
// Vencimiento token
// =======================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = '48h';

// =======================
// SEED autenticación
// =======================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
// =======================
// Base de datos
// =======================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {

    // 'mongodb+srv://mean_user:<contraseña>@cluster0.ckkqm.mongodb.net/cafe'
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


// =======================
// Google Client ID
// =======================

process.env.CLIENT_ID = process.env.CLIENT_ID || '710876525491-l80dc1m6hhlavsql2fequ9mt50g91g91.apps.googleusercontent.com';