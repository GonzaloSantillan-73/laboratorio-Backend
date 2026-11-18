import { Router } from 'express';
import {
    obtenerConsultas,
    obtenerConsultaPorId,
    crearConsulta,
    eliminarConsultaId
} from '../controllers/consultas.controllers.js';
import { validarBody, validarConsulta } from "../middlewares/validacion.middleware.js";
import { crearConsultaSchema, consultarConsultasSchema } from "../validators/consultas.schemas.js";
import { validarId } from "../middlewares/validarId.middleware.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import { cargarContextoUsuario, autorizarRoles } from "../middlewares/autorizacion.middleware.js";

const router = Router();

// token + cuenta activa + rol; con ...controlesAdministrador se despliegan en la ruta
const controlesAdministrador = [
    autenticarUsuario, cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR")
];

router.get('/', /* #swagger.summary = "Listar consultas (ADMINISTRADOR)" */ ...controlesAdministrador, validarConsulta(consultarConsultasSchema), obtenerConsultas);
router.get('/:id', /* #swagger.summary = "Consultar una consulta (ADMINISTRADOR)" */ ...controlesAdministrador, validarId, obtenerConsultaPorId);
router.post('/', /* #swagger.summary = "Registrar una consulta"
    #swagger.security = [] */ validarBody(crearConsultaSchema, "Los datos de la consulta son inválidos."), crearConsulta);
router.delete('/:id', /* #swagger.summary = "Eliminar una consulta (ADMINISTRADOR)" */ ...controlesAdministrador, validarId, eliminarConsultaId);

export default router;