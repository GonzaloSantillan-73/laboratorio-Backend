export const crearError = (mensaje, status = 500, detalles = null) => {
    const error = new Error(mensaje);
    error.status = status;
    if (detalles) {
        error.detalles = detalles;
    }
    return error;
};

export const detallarErroresZod = (zodError) => {
    return zodError.issues.map(issue => ({
        campo: issue.path.join('.'),
        mensaje: issue.message
    }));
};
