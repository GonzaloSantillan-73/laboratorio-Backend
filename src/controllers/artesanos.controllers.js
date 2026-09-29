import {
    obtenerArtesanosService,
    obtenerArtesanoPorIdService,
    crearArtesanoService,
    actualizarArtesanoService,
    eliminarArtesanoService,
} from "../services/artesanos.service.js";

export const obtenerArtesanos = async (req, res, next) => {
    try {
        const artesanos = await obtenerArtesanosService();
        return res.json(artesanos);
    } catch (error) {
        return next(error);
    }
};

export const obtenerArtesanosPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const artesano = await obtenerArtesanoPorIdService(id);
        return res.json(artesano);
    } catch (error) {
        return next(error);
    }
};

export const crearArtesano = async (req, res, next) => {
    try {
        const crearArtesanoDto = req.body;
        const nuevoArtesano = await crearArtesanoService(crearArtesanoDto);
        return res.status(201).json(nuevoArtesano);
    } catch (error) {
        return next(error);
    }
};

export const actualizarArtesanoId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const actualizarArtesanoDto = req.body;

        const artesanoActualizado = await actualizarArtesanoService(id, actualizarArtesanoDto);
        return res.json(artesanoActualizado);
    } catch (error) {
        return next(error);
    }
};

export const eliminarArtesanoId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const artesanoEliminado = await eliminarArtesanoService(id);

        return res.json({
            message: 'Artesano eliminado',
            artesano: artesanoEliminado,
        });
    } catch (error) {
        return next(error);
    }
};