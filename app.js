import express from 'express';
import { manejadorErrores } from './src/middlewares/manejadorErrores.js';
import artesanosRoutes from './src/routes/artesanos.routes.js'
import standRoutes from './src/routes/stand.routes.js'
import consultasRoutes from './src/routes/consultas.routes.js';
import productosRoutes from './src/routes/productos.routes.js'
import usuarioRoutes from './src/routes/usuarios.routes.js'
import rolesRoutes from './src/routes/roles.routes.js'
import "./src/config/jwt.js"
import { iniciarLimpiezaRevocaciones } from './src/tareas/limpiezaRevocaciones.js'

const app = express();
app.use(express.json());

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Bienvenido a la API REST');
});

//rutas
app.use('/api/artesanos', artesanosRoutes)
app.use('/api/stands', standRoutes);
app.use('/api/consultas', consultasRoutes);
app.use('/api/productos', productosRoutes)
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/roles', rolesRoutes)

app.use((req, res, next) => {
    const error = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    if (res.headersSent) return next(err)
    const mensajes = {
        P2002: "Ya existe un registro con esos datos únicos.",
        P2003: "La operación afecta registros relacionados.",
        P2025: "Registro no encontrado.",
        P2034: "Hubo otro cambio simultáneo. Reintentar."
    };
    const mensajeErrorPrisma = mensajes[err.code]
    const estado = mensajeErrorPrisma
        ? (err.code === "P2025" ? 404 : 409)
        : (err.status || 500);
    const mensaje = estado >= 500
        ? "Error interno del servidor."
        : (mensajeErrorPrisma || err.message)
    return res.status(estado).json({ mensaje })
});

app.use(manejadorErrores)

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
    iniciarLimpiezaRevocaciones();
});