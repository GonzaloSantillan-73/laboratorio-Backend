import { consultarProductoSchema } from '../validators/productos.schemas.js';
import { consultarUsuarioSchema } from '../validators/usuarios.schemas.js';
import { consultarRolSchema } from '../validators/roles.schemas.js';
import { consultarRubroSchema } from '../validators/rubros.schemas.js';
import { consultarPabellonSchema } from '../validators/pabellones.schemas.js';
import { detallarErroresZod, crearError } from '../utils/errores.js';

export const validarConsultarProducto = (req, res, next) => {
    const resultado = consultarProductoSchema.safeParse(req.query);
    if (!resultado.success) {
        const detalle = detallarErroresZod(resultado.error);
        return next(crearError('Parámetros de consulta de productos inválidos.', 400, detalle));
    }
    req.consultaProductos = resultado.data;
    return next();
};

export const validarConsultarUsuario = (req, res, next) => {
    const resultado = consultarUsuarioSchema.safeParse(req.query);
    if (!resultado.success) {
        const detalle = detallarErroresZod(resultado.error);
        return next(crearError('Parámetros de consulta de usuarios inválidos.', 400, detalle));
    }
    req.consultaUsuarios = resultado.data;
    return next();
};

export const validarConsultarRol = (req, res, next) => {
    const resultado = consultarRolSchema.safeParse(req.query);
    if (!resultado.success) {
        const detalle = detallarErroresZod(resultado.error);
        return next(crearError('Parámetros de consulta de roles inválidos.', 400, detalle));
    }
    req.consultaRoles = resultado.data;
    return next();
};

export const validarConsultarRubro = (req, res, next) => {
    const resultado = consultarRubroSchema.safeParse(req.query);
    if (!resultado.success) {
        const detalle = detallarErroresZod(resultado.error);
        return next(crearError('Parámetros de consulta de rubros inválidos.', 400, detalle));
    }
    req.consultaRubros = resultado.data;
    return next();
};

export const validarConsultarPabellon = (req, res, next) => {
    const resultado = consultarPabellonSchema.safeParse(req.query);
    if (!resultado.success) {
        const detalle = detallarErroresZod(resultado.error);
        return next(crearError('Parámetros de consulta de pabellones inválidos.', 400, detalle));
    }
    req.consultaPabellones = resultado.data;
    return next();
};
