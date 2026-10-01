export const crearError = (mensaje,status, detalle) => {
    const error = new Error(mensaje)
    error.status = status
    if(detalle){
        error.detalle = detalle
    }
    return error
}

export const detallarErroresZod = (errorZod) =>{
    return errorZod.issues.map((issue) => ({
        campo: issue.path.join('.') || null,
        mensaje: issue.message
    }))
}