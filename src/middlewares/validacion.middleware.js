export const validarBody = (schema, mensaje = "Los datos enviados son inválidos.") => {
    return (req, res, next) => {
        const resultado = schema.safeParse(req.body);
        if (!resultado.success) {
            return res.status(400).json({
                mensaje: mensaje,
                errores: resultado.error.issues
            });
        }
        req.bodyValidado = resultado.data;
        return next();
    };
};

export const validarParametros = (schema, mensaje = "Los parámetros son inválidos.") => {
    return (req, res, next) => {
        const resultado = schema.safeParse(req.params);
        if (!resultado.success) {
            return res.status(400).json({
                mensaje: mensaje,
                errores: resultado.error.issues
            });
        }
        req.parametrosValidados = resultado.data;
        return next();
    };
};

export const validarConsulta = (schema, mensaje = "Los parámetros de consulta son inválidos.") => {
    return (req, res, next) => {
        const resultado = schema.safeParse(req.query);
        if (!resultado.success) {
            return res.status(400).json({
                mensaje: mensaje,
                errores: resultado.error.issues
            });
        }
        req.consultaValidada = resultado.data;
        return next();
    };
};
