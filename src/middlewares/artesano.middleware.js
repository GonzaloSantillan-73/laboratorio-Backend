import {
    crearArtesanoSchema,
    actualizarArtesanoSchema,
    consultarArtesanosSchema
} from "../validators/artesanos.schemas.js";

export const validarCreacionArtesano = (req, res, next) => {
    const resultado = crearArtesanoSchema.safeParse(req.body)
    if (!resultado.success) {
        return res.status(400).json({
            mensaje: "Los datos enviados son invalidos.",
            errores: resultado.error.issues
        })
    }
    req.body = resultado.data
    return next()
}

export const validarActualizacionArtesano = (req, res, next) => {
    const resultado = actualizarArtesanoSchema.safeParse(req.body);

    if (!resultado.success) {
        return res.status(400).json({
            mensaje: "Los datos enviados para la actualización son inválidos.",
            errores: resultado.error.issues,
        });
    }

    req.body = resultado.data;
    return next();
};

// Middleware genérico que recibe cualquier esquema de Zod
/*export const validarSchema = (schema) => (req, res, next) => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
        return res.status(400).json({
            mensaje: "Los datos enviados son inválidos.",
            errores: resultado.error.issues,
        });
    }

    req.body = resultado.data;
    return next();
};*/


export const validarConsultaArtesanos = (req, res, next) => {
    const resultado = consultarArtesanosSchema.safeParse(req.query);

    if (!resultado.success) {
        return res.status(400).json({
            mensaje: "Los parámetros de consulta son inválidos.",
            errores: resultado.error.issues
        });
    }

    req.consultaArtesanos = resultado.data;
    return next();
};