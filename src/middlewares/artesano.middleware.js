import { crearArtesanoSchema } from "../validators/artesanos.schemas.js";

export const validarCreacionArtesano = (req,res,next) => {
    const resultado = crearArtesanoSchema.safeParse(req.body)
    if(!resultado.success){
        return res.status(400).json({
            mensaje: "Los datos enviados son invalidos.",
            errores: resultado.error.issues
        })
    }
    req.body = resultado.data
    return next()
}