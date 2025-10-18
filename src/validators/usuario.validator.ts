import { body, ValidationChain } from 'express-validator';

export const usuarioCreateValidator = (): ValidationChain[] => [
    body('nombre').isString().trim().notEmpty().withMessage('nombre es requerido'),
    body('apellido').isString().trim().notEmpty().withMessage('apellido es requerido'),
    body('email').isEmail().withMessage('email inválido').normalizeEmail(),
    body('password')
        .isString()
        .isLength({ min: 8 })
        .withMessage('password debe tener al menos 8 caracteres')
];

export const usuarioLoginValidator = (): ValidationChain[] => [
    body('email').isEmail().withMessage('email inválido').normalizeEmail(),
    body('password').isString().notEmpty().withMessage('password es requerido')
];
