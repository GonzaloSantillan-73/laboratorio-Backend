import express from 'express';
import { manejadorErrores } from './src/middlewares/manejadorErrores.js';
import artesanosRoutes from './src/routes/artesanos.routes.js'
import standRoutes from './src/routes/stand.routes.js'
import consultasRoutes from './src/routes/consultas.routes.js';
import productosRoutes from './src/routes/productos.routes.js'
import usuarioRoutes from './src/routes/usuarios.routes.js'
import rolesRoutes from './src/routes/roles.routes.js'
import rubrosRoutes from './src/routes/rubros.routes.js'
import pabellonesRoutes from './src/routes/pabellones.routes.js'
import coordenadasRoutes from './src/routes/coordenadas.routes.js'
import provinciasRouter from './src/routes/provincias.routes.js'
import departamentosRouter from './src/routes/departamentos.routes.js'
import localidadesRouter from './src/routes/localidades.routes.js'
import "./src/config/jwt.js"
import { iniciarLimpiezaRevocaciones } from './src/tareas/limpiezaRevocaciones.js'

import swaggerUi from "swagger-ui-express";
import { readFileSync } from "node:fs";

const app = express();
app.use(express.json());

const PORT = 3000;

// Carga de la documentación OpenAPI generada
const swaggerDocument = JSON.parse(
    readFileSync(new URL("./swagger-output.json", import.meta.url), "utf8"),
);

app.get('/', (req, res) => {
    // #swagger.ignore = true
    res.send('Bienvenido a la API REST');
});

//rutas
// #swagger.security se hereda en todas las operaciones del router.
// Las operaciones públicas lo anulan con #swagger.security = [] en su ruta.
app.use('/api/artesanos', artesanosRoutes
    /* #swagger.security = [{ bearerAuth: [] }] */
)
app.use('/api/stands', standRoutes
    /* #swagger.security = [{ bearerAuth: [] }] */
);
app.use('/api/consultas', consultasRoutes
    /* #swagger.tags = ["Consultas"]
       #swagger.security = [{ bearerAuth: [] }] */
);
app.use('/api/productos', productosRoutes
    /* #swagger.security = [{ bearerAuth: [] }] */
)
app.use('/api/usuarios', usuarioRoutes
    /* #swagger.security = [{ bearerAuth: [] }] */
)
app.use('/api/roles', rolesRoutes
    /* #swagger.tags = ["Roles"]
       #swagger.security = [{ bearerAuth: [] }] */
)
app.use('/api/rubros', rubrosRoutes
    /* #swagger.tags = ["Rubros"]
       #swagger.security = [{ bearerAuth: [] }] */
)
app.use('/api/pabellones', pabellonesRoutes
    /* #swagger.tags = ["Pabellones"]
       #swagger.security = [{ bearerAuth: [] }] */
)
app.use('/api/coordenadas', coordenadasRoutes
    /* #swagger.tags = ["Coordenadas"]
       #swagger.security = [{ bearerAuth: [] }] */
)
app.use('/api/provincias', provinciasRouter /* #swagger.tags = ["Ubicaciones"] */)
app.use('/api/departamentos', departamentosRouter /* #swagger.tags = ["Ubicaciones"] */)
app.use('/api/localidades', localidadesRouter /* #swagger.tags = ["Ubicaciones"] */)

// Publicación de Swagger UI en la ruta /docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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