import { Router } from 'express';
import {
    obtenerConsultas,
    obtenerConsultaPorId,
    crearConsulta,
    eliminarConsultaId
} from '../controllers/consultas.controllers.js';
import {
    validarCreacionConsulta,
    validarConsultaConsultas
} from '../middlewares/consulta.middleware.js';
import { validarId } from "../middlewares/validarId.middleware.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import { cargarContextoUsuario, autorizarRoles } from "../middlewares/autorizacion.middleware.js";

const router = Router();

const controlesAdministrador = [
    autenticarUsuario, cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR")
];

router.get('/', /* #swagger.summary = "Listar consultas (ADMINISTRADOR)" */ ...controlesAdministrador, validarConsultaConsultas, obtenerConsultas);
router.get('/:id', /* #swagger.summary = "Consultar una consulta (ADMINISTRADOR)" */ ...controlesAdministrador, validarId, obtenerConsultaPorId);
router.post('/', /* #swagger.summary = "Registrar una consulta"
    #swagger.security = [] */ validarCreacionConsulta, crearConsulta);
router.delete('/:id', /* #swagger.summary = "Eliminar una consulta (ADMINISTRADOR)" */ ...controlesAdministrador, validarId, eliminarConsultaId);

export default router;