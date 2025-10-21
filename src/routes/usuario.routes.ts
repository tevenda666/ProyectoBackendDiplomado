import { Router } from 'express';
import { validationResult } from 'express-validator';
import { createUsuario } from '../controllers/usuario.controller';
import { usuarioCreateValidator } from '../validators/usuario.validator';
import { loginUsuario } from '../controllers/usuario.controller'; // Import the loginUsuario controller
import { usuarioLoginValidator } from '../validators/usuario.validator'; // Import the usuarioLoginValidator

const router = Router();

function handleValidationErrors(req: any, res: any, next: any) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    return next();
}

router.post('/crearUsuario', usuarioCreateValidator(), handleValidationErrors, createUsuario);
router.post('/login', usuarioLoginValidator(), handleValidationErrors, loginUsuario); // Add the new login route

export default router;
