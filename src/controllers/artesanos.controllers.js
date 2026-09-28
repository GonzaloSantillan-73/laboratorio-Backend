import prisma from '../config/prisma.js';

export const obtenerArtesanos = async (req, res) => {
    try {
        const artesanos = await prisma.artesano.findMany();
        return res.json(artesanos);
    } catch (error) {
        return res.status(500).json({ mensaje: "Error al obtener los artesanos", error: error.message });
    }
};