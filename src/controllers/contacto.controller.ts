import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ContactoModel, { IContactoDocument, ITelefono } from '../models/contacto.model';
import ContactoResponse from '../types/contacto';
import logger from '../utils/logger';

export const createContacto = async (req: Request, res: Response) => {
    try {
        const { usuarioId, nombre, telefonos } = req.body;

        if (!usuarioId || !nombre) {
            return res.status(400).json({ message: 'usuarioId y nombre son requeridos' });
        }

        if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
            return res.status(400).json({ message: 'usuarioId inválido' });
        }

        if (telefonos) {
            if (!Array.isArray(telefonos)) return res.status(400).json({ message: 'telefonos debe ser un arreglo' });
            if (telefonos.length > 3) return res.status(400).json({ message: 'Máximo 3 teléfonos permitidos' });

            for (const t of telefonos) {
                if (!t || !t.tipo || !t.numero) return res.status(400).json({ message: 'Cada teléfono necesita tipo y numero' });
                if (!['personal', 'oficina', 'emergencia'].includes(t.tipo)) return res.status(400).json({ message: 'Tipo de teléfono inválido' });
            }
        }

        const contacto = await ContactoModel.create({ usuarioId, nombre, telefonos: telefonos || [] });

        const resp: ContactoResponse & { id: string } = {
            id: contacto._id.toString(),
            usuarioId: contacto.usuarioId.toString(),
            nombre: contacto.nombre,
            telefonos: contacto.telefonos.map((t) => ({ tipo: t.tipo, numero: t.numero }))
        };

        return res.status(201).json(resp);
    } catch (err) {
        logger.error(err, { route: 'createContacto' });
        return res.status(500).json({ message: 'Error interno' });
    }
};

export const addTelefono = async (req: Request, res: Response) => {
    try {
        const { contactoId } = req.params;
        const { tipo, numero } = req.body as ITelefono;

        if (!contactoId || !mongoose.Types.ObjectId.isValid(contactoId)) {
            return res.status(400).json({ message: 'contactoId inválido' });
        }
        if (!tipo || !numero) return res.status(400).json({ message: 'tipo y numero son requeridos' });
        if (!['personal', 'oficina', 'emergencia'].includes(tipo)) return res.status(400).json({ message: 'Tipo de teléfono inválido' });
        const contacto = await ContactoModel.findById(contactoId);
        if (!contacto) return res.status(404).json({ message: 'Contacto no encontrado' });

        if (contacto.telefonos.length >= 3) return res.status(400).json({ message: 'No se pueden agregar más de 3 teléfonos' });

        contacto.telefonos.push({ tipo, numero });
        await contacto.save();

        const resp: ContactoResponse & { id: string } = {
            id: contacto._id.toString(),
            usuarioId: contacto.usuarioId.toString(),
            nombre: contacto.nombre,
            telefonos: contacto.telefonos.map((t) => ({ tipo: t.tipo, numero: t.numero }))
        };

        return res.json(resp);
    } catch (err) {
        logger.error(err, { route: 'addTelefono' });
        return res.status(500).json({ message: 'Error interno' });
    }
};

export const getContacto = async (req: Request, res: Response) => {
    try {
        const { contactoId } = req.params;
        if (!contactoId || !mongoose.Types.ObjectId.isValid(contactoId)) {
            return res.status(400).json({ message: 'contactoId inválido' });
        }

        const contacto = await ContactoModel.findById(contactoId);
        if (!contacto) return res.status(404).json({ message: 'Contacto no encontrado' });

        const resp: ContactoResponse & { id: string } = {
            id: contacto._id.toString(),
            usuarioId: contacto.usuarioId.toString(),
            nombre: contacto.nombre,
            telefonos: contacto.telefonos.map((t) => ({ tipo: t.tipo, numero: t.numero })),
        };

        return res.json(resp);
    } catch (err) {
        logger.error(err, { route: 'getContacto' });
        return res.status(500).json({ message: 'Error interno' });
    }
};

export const getContactos = async (req: Request, res: Response) => {
    try {
        const { usuarioId } = req.query as { usuarioId?: string };

        if (!usuarioId) return res.status(400).json({ message: 'usuarioId query es requerido' });
        if (!mongoose.Types.ObjectId.isValid(usuarioId)) return res.status(400).json({ message: 'usuarioId inválido' });

        const contactos = await ContactoModel.find({ usuarioId });

        const resp = contactos.map((contacto) => ({
            id: contacto._id.toString(),
            usuarioId: contacto.usuarioId.toString(),
            nombre: contacto.nombre,
            telefonos: contacto.telefonos.map((t) => ({ tipo: t.tipo, numero: t.numero })),
        } as ContactoResponse & { id: string }));

        return res.json(resp);
    } catch (err) {
        logger.error(err, { route: 'getContactos' });
        return res.status(500).json({ message: 'Error interno' });
    }
};

export const updateContacto = async (req: Request, res: Response) => {
    try {
        const { contactoId } = req.params;
        const { nombre, telefonos } = req.body as { nombre?: string; telefonos?: ITelefono[] };

        if (!contactoId || !mongoose.Types.ObjectId.isValid(contactoId)) {
            return res.status(400).json({ message: 'contactoId inválido' });
        }

        const contacto = await ContactoModel.findById(contactoId);
        if (!contacto) return res.status(404).json({ message: 'Contacto no encontrado' });

        if (nombre) contacto.nombre = nombre;

        if (telefonos) {
            if (!Array.isArray(telefonos)) return res.status(400).json({ message: 'telefonos debe ser un arreglo' });
            if (telefonos.length > 3) return res.status(400).json({ message: 'Máximo 3 teléfonos permitidos' });
            contacto.telefonos = telefonos as any;
        }

        await contacto.save();

        const resp: ContactoResponse & { id: string } = {
            id: contacto._id.toString(),
            usuarioId: contacto.usuarioId.toString(),
            nombre: contacto.nombre,
            telefonos: contacto.telefonos.map((t) => ({ tipo: t.tipo, numero: t.numero })),
        };

        return res.json(resp);
    } catch (err) {
        logger.error(err, { route: 'updateContacto' });
        return res.status(500).json({ message: 'Error interno' });
    }
};

export const deleteContacto = async (req: Request, res: Response) => {
    try {
        const { contactoId } = req.params;
        if (!contactoId || !mongoose.Types.ObjectId.isValid(contactoId)) {
            return res.status(400).json({ message: 'contactoId inválido' });
        }

        const contacto = await ContactoModel.findById(contactoId);
        if (!contacto) return res.status(404).json({ message: 'Contacto no encontrado' });

        await ContactoModel.deleteOne({ _id: contactoId });

        return res.status(204).send();
    } catch (err) {
        logger.error(err, { route: 'deleteContacto' });
        return res.status(500).json({ message: 'Error interno' });
    }
};

export default {
    createContacto,
    addTelefono,
    getContacto,
    getContactos,
    updateContacto,
    deleteContacto,
};
