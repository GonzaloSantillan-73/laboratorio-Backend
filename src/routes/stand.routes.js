import { Router } from 'express';
import {
    obtenerStands,
    obtenerStandPorId,
    crearStand,
    actualizarStandId,
    eliminarStandId
} from '../controllers/stands.controllers.js';
import { validarId } from "../middlewares/validarId.middleware.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import { cargarContextoUsuario, autorizarRoles } from "../middlewares/autorizacion.middleware.js";
import { validarBody, validarConsulta } from "../middlewares/validacion.middleware.js";
import {
    crearStandSchema,
    actualizarStandSchema,
    consultarStandsSchema
} from "../validators/stands.schemas.js";

const router = Router();

const controlesAdministrador = [
    autenticarUsuario, cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR")
];

router.get('/',
    validarConsulta(consultarStandsSchema, "Los parámetros de consulta de stands son inválidos."),
    obtenerStands);

router.get('/:id', validarId, obtenerStandPorId);

router.post('/', ...controlesAdministrador,
    validarBody(crearStandSchema, "Los datos enviados para el stand son inválidos."),
    crearStand);

router.put('/:id', ...controlesAdministrador, validarId,
    validarBody(actualizarStandSchema, "Los datos enviados para la actualización del stand son inválidos."),
    actualizarStandId);

router.delete('/:id', ...controlesAdministrador, validarId,
    eliminarStandId);

export default router;
