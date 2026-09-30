import {
    consultarConsultasService,
    obtenerConsultaPorIdService,
    crearConsultaService,
    eliminarConsultaService
} from "../services/consultas.service.js";

export const obtenerConsultas = async (req, res, next) => {
    try {
        const resultado = await consultarConsultasService(req.consultaConsultas);
        return res.status(200).json(resultado);
    } catch (error) {
        return next(error);
    }
};

export const obtenerConsultaPorId = async (req, res, next) => {
    try {
        const consulta = await obtenerConsultaPorIdService(req.params.id);
        return res.status(200).json(consulta);
    } catch (error) {
        return next(error);
    }
};

export const crearConsulta = async (req, res, next) => {
    try {
        const nuevaConsulta = await crearConsultaService(req.body);
        return res.status(201).json(nuevaConsulta);
    } catch (error) {
        return next(error);
    }
};

export const eliminarConsultaId = async (req, res, next) => {
    try {
        const consultaEliminada = await eliminarConsultaService(req.params.id);
        return res.status(200).json({
            mensaje: "Consulta eliminada exitosamente",
            consulta: consultaEliminada
        });
    } catch (error) {
        return next(error);
    }
};