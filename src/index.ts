import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import usuarioRoutes from './routes/usuario.routes';
import contactoRoutes from './routes/contacto.routes';
import sanitizeMiddleware from './middleware/sanitize.middleware';

dotenv.config();

const app = express();
app.use(express.json());
app.use(sanitizeMiddleware);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydb';

app.get('/', (req, res) => {
    res.json({ message: 'API de Contactos' });
});


app.use('/api/usuarios', usuarioRoutes);
app.use('/api/contactos', contactoRoutes);

async function tryConnect(retries = 5, delayMs = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            await mongoose.connect(MONGO_URI);
            console.log('Conectado a DB');
            return;
        } catch (err) {
            console.warn(`Intento ${i + 1} fallido de conectar a MongoDB: ${err}`);
            await new Promise((r) => setTimeout(r, delayMs));
        }
    }
    console.warn('No se pudo conectar a MongoDB tras varios intentos');
}

async function start() {
    app.listen(PORT, () => {
        console.log(`Servidor Online`);
    });

    tryConnect().catch((err) => {
        console.error('Error inesperado al intentar conectar a MongoDB:', err);
    });
}

start();
