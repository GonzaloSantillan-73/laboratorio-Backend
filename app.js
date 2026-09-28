import express from 'express';
import {manejadorErrores} from './src/middlewares/manejadorErrores.js';
import artesanosRoutes from './src/routes/artesanos.routes.js'

const app = express();
app.use(express.json());

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Bienvenido a la API REST');
});

//rutas
app.use('/artesanos',artesanosRoutes)

app.use((req, res, next) => {
    const error = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
    error.status = 404;
    next(error);
});

app.use(manejadorErrores);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});