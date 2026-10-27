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

router.get('/', ...controlesAdministrador, validarConsultaConsultas, obtenerConsultas);
router.get('/:id', ...controlesAdministrador, validarId, obtenerConsultaPorId);
router.post('/', validarCreacionConsulta, crearConsulta);
router.delete('/:id', ...controlesAdministrador, validarId, eliminarConsultaId);

export default router;