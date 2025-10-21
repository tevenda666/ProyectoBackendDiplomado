import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UsuarioModel from '../models/usuario.model';
import UsuarioResponse from '../types/usuario';
import logger from '../utils/logger';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

export const createUsuario = async (req: Request, res: Response) => {
    try {
        const { nombre, apellido, email, password } = req.body;

        if (!nombre || !apellido || !email || !password) {
            return res.status(400).json({ message: 'nombre, apellido, email y password son requeridos' });
        }

        const existing = await UsuarioModel.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'El email ya está registrado' });
        }

        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashed = await bcrypt.hash(password, salt);

        const usuario = await UsuarioModel.create({ nombre, apellido, email, password: hashed });

        const usuarioResp: UsuarioResponse = {
            id: usuario._id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
        };

        return res.status(201).json(usuarioResp);
    } catch (err) {
        logger.error(err, { route: 'createUsuario' });
        return res.status(500).json({ message: 'Error interno' });
    }
};

export const loginUsuario = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'email y password son requeridos' });

        const usuario = await UsuarioModel.findOne({ email }).select('+password');
        if (!usuario) return res.status(401).json({ message: 'Credenciales inválidas' });

        const match = await bcrypt.compare(password, usuario.password as string);
        if (!match) return res.status(401).json({ message: 'Credenciales inválidas' });

        const usuarioResp: UsuarioResponse = {
            id: usuario._id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
        };

        return res.json(usuarioResp);
    } catch (err) {
        logger.error(err, { route: 'loginUsuario' });
        return res.status(500).json({ message: 'Error interno' });
    }
};
