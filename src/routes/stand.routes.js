import { Router } from 'express';
import {
    obtenerStands,
    obtenerStandPorId,
    crearStand,
    actualizarStandId,
    eliminarStandId
} from '../controllers/stands.controllers.js';
import {
    validarCreacionStand,
    validarActualizacionStand,
    validarConsultaStands
} from '../middlewares/stand.middleware.js';
import { validarId } from "../middlewares/validarId.middleware.js";

const router = Router();

router.get('/', validarConsultaStands, obtenerStands);
router.get('/:id', validarId, obtenerStandPorId);
router.post('/', validarCreacionStand, crearStand);
router.put('/:id', validarId, validarActualizacionStand, actualizarStandId);
router.delete('/:id', validarId, eliminarStandId);

export default router;