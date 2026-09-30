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

const router = Router();

router.get('/', validarConsultaConsultas, obtenerConsultas);
router.get('/:id', validarId, obtenerConsultaPorId);
router.post('/', validarCreacionConsulta, crearConsulta);
router.delete('/:id', validarId, eliminarConsultaId);

export default router;