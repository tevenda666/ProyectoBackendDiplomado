import { Router } from 'express';
import { validationResult } from 'express-validator';
import contactoController from '../controllers/contacto.controller';
import { contactoCreateValidator, telefonoAddValidator, contactoGetValidator, contactosListValidator } from '../validators/contacto.validator';

const router = Router();

function handleValidationErrors(req: any, res: any, next: any) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    return next();
}

router.post('/', contactoCreateValidator(), handleValidationErrors, contactoController.createContacto);
router.post('/:contactoId/telefonos', telefonoAddValidator(), handleValidationErrors, contactoController.addTelefono);
router.get('/:contactoId', contactoGetValidator(), handleValidationErrors, contactoController.getContacto);
router.get('/', contactosListValidator(), handleValidationErrors, contactoController.getContactos);
export default router;
