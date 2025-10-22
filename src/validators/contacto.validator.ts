import { body, param } from 'express-validator';
import { query } from 'express-validator';

export function contactoCreateValidator() {
    return [
        body('usuarioId').exists().withMessage('usuarioId es requerido').isString().withMessage('usuarioId debe ser string').notEmpty(),
        body('nombre').exists().withMessage('nombre es requerido').isString().withMessage('nombre debe ser string').isLength({ min: 1 }),
        body('telefonos').optional().isArray({ max: 3 }).withMessage('telefonos debe ser un arreglo con máximo 3 elementos'),
        body('telefonos.*.tipo').optional().isIn(['personal', 'oficina', 'emergencia']).withMessage('tipo de telefono inválido'),
        body('telefonos.*.numero').optional().isString().withMessage('numero debe ser string').isLength({ min: 3 }),
    ];
}

export function contactoGetValidator() {
    return [param('contactoId').exists().withMessage('contactoId es requerido').isString().notEmpty()];
}

export function contactosListValidator() {
    return [query('usuarioId').exists().withMessage('usuarioId es requerido').isString().notEmpty()];
}

export function contactoUpdateValidator() {
    return [
        param('contactoId').exists().withMessage('contactoId es requerido').isString().notEmpty(),
        body('nombre').optional().isString().withMessage('nombre debe ser string').isLength({ min: 1 }),
        body('telefonos').optional().isArray({ max: 3 }).withMessage('telefonos debe ser un arreglo con máximo 3 elementos'),
        body('telefonos.*.tipo').optional().isIn(['personal', 'oficina', 'emergencia']).withMessage('tipo de telefono inválido'),
        body('telefonos.*.numero').optional().isString().withMessage('numero debe ser string').isLength({ min: 3 }),
    ];
}

export function contactoDeleteValidator() {
    return [param('contactoId').exists().withMessage('contactoId es requerido').isString().notEmpty()];
}

export function telefonoAddValidator() {
    return [
        param('contactoId').exists().withMessage('contactoId es requerido').isString().notEmpty(),
        body('tipo').exists().withMessage('tipo es requerido').isIn(['personal', 'oficina', 'emergencia']),
        body('numero').exists().withMessage('numero es requerido').isString().isLength({ min: 3 }),
    ];
}
