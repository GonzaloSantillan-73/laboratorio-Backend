import prisma from '../config/prisma.js';

export const obtenerArtesanos = async (req, res) => {
    try {
        const artesanos = await prisma.artesano.findMany();
        return res.json(artesanos);
    } catch (error) {
        return res.status(500).json({ mensaje: "Error al obtener los artesanos", error: error.message });
    }
};

export const obtenerArtesanosPorId = async (req, res) => {
    try {
        const {id} = req.params
        const artesano = await prisma.artesano.findUnique({
            where: {id: parseInt(id)}
        })
        if(!artesano){
            const error = new Error(`El artesano con el id ${id} no existe`)
            error.status = 404
            return next(error)
        }
        return res.json(artesano)
    } catch (error) {
        return next(error)
    }
}