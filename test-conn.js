// test-conn.js
// Simple script to test connection to MongoDB using MONGO_URI from .env
require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('No hay MONGO_URI en .env. Crea un .env basado en .env.example y añade MONGO_URI.');
  process.exit(2);
}

console.log(
  'Intentando conectar a MongoDB con la URI de .env (ocultando credenciales en la salida)...',
);

mongoose
  .connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('Conexión a MongoDB: OK');
    return mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:');
    // Print friendly error + full error message
    console.error(err && err.message ? err.message : err);
    process.exit(1);
  });
