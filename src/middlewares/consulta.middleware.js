import { 
    crearConsultaSchema, 
    consultarConsultasSchema 
} from "../validators/consultas.schemas.js";

export const validarCreacionConsulta = (req, res, next) => {
    const resultado = crearConsultaSchema.safeParse(req.body);
    if (!resultado.success) {
        return res.status(400).json({
            mensaje: "Los datos de la consulta son inválidos.",
            errores: resultado.error.issues,
        });
    }
    req.body = resultado.data;
    return next();
};

export const validarConsultaConsultas = (req, res, next) => {
    const resultado = consultarConsultasSchema.safeParse(req.query);
    if (!resultado.success) {
        return res.status(400).json({
            mensaje: "Los parámetros de consulta son inválidos.",
            errores: resultado.error.issues,
        });
    }
    req.consultaConsultas = resultado.data;
    return next();
};