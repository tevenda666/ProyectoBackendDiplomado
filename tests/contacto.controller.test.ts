import { vi, describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';

import ContactoModel from '../src/models/contacto.model';
import { createContacto, addTelefono, getContacto, getContactos } from '../src/controllers/contacto.controller';

const mockCreate = vi.fn();
const mockFindById = vi.fn();
const mockFind = vi.fn();
const mockDeleteOne = vi.fn();

function mockRes() {
    const res: any = {};
    res.status = vi.fn().mockImplementation((code: number) => { res.statusCode = code; return res; });
    res.json = vi.fn().mockImplementation((body: any) => { res.body = body; return res; });
    res.send = vi.fn().mockImplementation((body?: any) => { if (body !== undefined) res.body = body; return res; });
    return res;
}

beforeEach(() => {
    // assign mock implementations to the real model methods
    (ContactoModel as any).create = mockCreate;
    (ContactoModel as any).findById = mockFindById;
    (ContactoModel as any).find = mockFind;
    (ContactoModel as any).deleteOne = mockDeleteOne;

    mockCreate.mockReset();
    mockFindById.mockReset();
    mockFind.mockReset();
    mockDeleteOne.mockReset();
});

describe('contacto.controller', () => {
    it('createContacto - success returns 201 and ContactoResponse', async () => {
        const usuarioId = new mongoose.Types.ObjectId().toString();
        const nombre = 'Ana';

        const created = {
            _id: new mongoose.Types.ObjectId(),
            usuarioId: new mongoose.Types.ObjectId(usuarioId),
            nombre,
            telefonos: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        } as any;

        mockCreate.mockResolvedValue(created);

        const req: any = { body: { usuarioId, nombre, telefonos: [] } };
        const res = mockRes();

        await createContacto(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.nombre).toBe(nombre);
        expect(res.body.usuarioId).toBe(usuarioId);
    });

    it('createContacto - missing usuarioId or nombre returns 400', async () => {
        const req: any = { body: { nombre: '' } };
        const res = mockRes();

        await createContacto(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('addTelefono - success adds telefono and returns ContactoResponse', async () => {
        const _id = new mongoose.Types.ObjectId().toString();
        const usuarioId = new mongoose.Types.ObjectId().toString();
        const initial = {
            _id: new mongoose.Types.ObjectId(_id),
            usuarioId: new mongoose.Types.ObjectId(usuarioId),
            nombre: 'Luis',
            telefonos: [{ tipo: 'personal', numero: '3001112222' }],
            save: vi.fn().mockResolvedValue(true),
        } as any;

        mockFindById.mockResolvedValue(initial);

        const req: any = { params: { contactoId: _id }, body: { tipo: 'oficina', numero: '3003334444' } };
        const res = mockRes();

        await addTelefono(req, res);

        expect(initial.save).toHaveBeenCalled();
        expect(res.body).toHaveProperty('telefonos');
        expect(res.body.telefonos.length).toBe(2);
        expect(res.body.telefonos.find((t: any) => t.numero === '3003334444')).toBeTruthy();
    });

    it('addTelefono - returns 400 if already 3 telefonos', async () => {
        const usuarioId = new mongoose.Types.ObjectId().toString();
        const full = {
            _id: new mongoose.Types.ObjectId(usuarioId),
            usuarioId: new mongoose.Types.ObjectId(),
            nombre: 'Full',
            telefonos: [
                { tipo: 'personal', numero: '1' },
                { tipo: 'personal', numero: '2' },
                { tipo: 'personal', numero: '3' },
            ],
            save: vi.fn(),
        } as any;

        mockFindById.mockResolvedValue(full);

        const req: any = { params: { contactoId: usuarioId }, body: { tipo: 'personal', numero: '999' } };
        const res = mockRes();

        await addTelefono(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('getContacto - success returns ContactoResponse', async () => {
        const _id = new mongoose.Types.ObjectId().toString();
        const usuarioId = new mongoose.Types.ObjectId().toString();
        const doc = {
            _id: new mongoose.Types.ObjectId(_id),
            usuarioId: new mongoose.Types.ObjectId(usuarioId),
            nombre: 'GetTest',
            telefonos: [{ tipo: 'personal', numero: '555' }],
            createdAt: new Date(),
            updatedAt: new Date(),
        } as any;

        mockFindById.mockResolvedValue(doc);

        const req: any = { params: { contactoId: _id } };
        const res = mockRes();

        await getContacto(req, res);

        expect(res.body).toHaveProperty('id');
        expect(res.body.nombre).toBe('GetTest');
        expect(res.body.telefonos.length).toBe(1);
    });

    it('getContacto - returns 404 when not found', async () => {
        const contactoId = new mongoose.Types.ObjectId().toString();
        mockFindById.mockResolvedValue(null);

        const req: any = { params: { contactoId } };
        const res = mockRes();

        await getContacto(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it('getContactos - returns list for usuarioId', async () => {
        const usuarioId = new mongoose.Types.ObjectId().toString();
        const docs = [
            {
                _id: new mongoose.Types.ObjectId(),
                usuarioId: new mongoose.Types.ObjectId(usuarioId),
                nombre: 'ListTest',
                telefonos: [],
            },
        ] as any;

        mockFind.mockResolvedValue(docs);

        const req: any = { query: { usuarioId } };
        const res = mockRes();

        await getContactos(req, res);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0].usuarioId).toBe(usuarioId);
    });

    it('updateContacto - success updates and returns ContactoResponse', async () => {
        const _id = new mongoose.Types.ObjectId().toString();
        const usuarioId = new mongoose.Types.ObjectId().toString();
        const existing = {
            _id: new mongoose.Types.ObjectId(_id),
            usuarioId: new mongoose.Types.ObjectId(usuarioId),
            nombre: 'OldName',
            telefonos: [],
            save: vi.fn().mockResolvedValue(true),
        } as any;

        mockFindById.mockResolvedValue(existing);

        const req: any = { params: { contactoId: _id }, body: { nombre: 'NewName', telefonos: [{ tipo: 'personal', numero: '123' }] } };
        const res = mockRes();

        const { updateContacto } = await import('../src/controllers/contacto.controller');

        await updateContacto(req, res);

        expect(existing.save).toHaveBeenCalled();
        expect(res.body.nombre).toBe('NewName');
        expect(res.body.telefonos.length).toBe(1);
    });

    it('updateContacto - returns 404 when not found', async () => {
        const contactoId = new mongoose.Types.ObjectId().toString();
        mockFindById.mockResolvedValue(null);

        const req: any = { params: { contactoId }, body: { nombre: 'x' } };
        const res = mockRes();

        const { updateContacto } = await import('../src/controllers/contacto.controller');

        await updateContacto(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it('deleteContacto - success returns 204', async () => {
        const contactoId = new mongoose.Types.ObjectId().toString();
        const existing = { _id: new mongoose.Types.ObjectId(contactoId) } as any;
        mockFindById.mockResolvedValue(existing);
        mockDeleteOne.mockResolvedValue({ deletedCount: 1 });

        const req: any = { params: { contactoId } };
        const res = mockRes();

        const { deleteContacto } = await import('../src/controllers/contacto.controller');

        await deleteContacto(req, res);

        expect(res.statusCode).toBe(204);
    });

    it('deleteContacto - returns 404 when not found', async () => {
        const contactoId = new mongoose.Types.ObjectId().toString();
        mockFindById.mockResolvedValue(null);

        const req: any = { params: { contactoId } };
        const res = mockRes();

        const { deleteContacto } = await import('../src/controllers/contacto.controller');

        await deleteContacto(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });
});
