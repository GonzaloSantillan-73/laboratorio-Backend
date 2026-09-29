import {
    obtenerStandsService,
    obtenerStandPorIdService,
    crearStandService,
    actualizarStandService,
    eliminarStandService,
    consultarStandsService
} from "../services/stands.service.js";

export const obtenerStands = async (req, res, next) => {
    try {
        const criteriosConsulta = req.consultaStands;
        const resultado = await consultarStandsService(criteriosConsulta);

        return res.status(200).json(resultado);
    } catch (error) {
        return next(error);
    }
};

export const obtenerStandPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const stand = await obtenerStandPorIdService(id);
        return res.status(200).json(stand);
    } catch (error) {
        return next(error);
    }
};

export const crearStand = async (req, res, next) => {
    try {
        const crearStandDto = req.body;
        const nuevoStand = await crearStandService(crearStandDto);
        return res.status(201).json(nuevoStand);
    } catch (error) {
        return next(error);
    }
};

export const actualizarStandId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const actualizarStandDto = req.body;

        const standActualizado = await actualizarStandService(id, actualizarStandDto);
        return res.status(200).json(standActualizado);
    } catch (error) {
        return next(error);
    }
};

export const eliminarStandId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const standEliminado = await eliminarStandService(id);

        return res.status(200).json({
            mensaje: 'Stand eliminado exitosamente',
            stand: standEliminado,
        });
    } catch (error) {
        return next(error);
    }
};