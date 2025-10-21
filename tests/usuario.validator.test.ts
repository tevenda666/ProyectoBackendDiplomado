import { describe, it, expect } from 'vitest';
import { validationResult } from 'express-validator';
import { usuarioCreateValidator } from '../src/validators/usuario.validator';

// Helper to run validation chains on a fake request object
async function runValidatorsOnBody(body: any) {
    const req: any = { body, params: {}, query: {} };
    const chains = usuarioCreateValidator();
    for (const chain of chains) {

        await chain.run(req);
    }
    return validationResult(req);
}

describe('usuarioCreateValidator', () => {
    it('debe fallar con datos inválidos', async () => {
        const bad = { nombre: '', apellido: '', email: 'not-an-email', password: '123' };
        const result = await runValidatorsOnBody(bad);
        expect(result.isEmpty()).toBe(false);
        const errors = result.array();

        expect(errors.length).toBeGreaterThanOrEqual(3);
        const fields = errors.map((e) => (e as any).param);
        expect(fields).toContain('nombre');
        expect(fields).toContain('apellido');
        expect(fields).toContain('email');
    });

    it('debe pasar con datos válidos', async () => {
        const good = { nombre: 'Juan', apellido: 'Perez', email: 'juan@example.com', password: 'Secret123' };
        const result = await runValidatorsOnBody(good);
        expect(result.isEmpty()).toBe(true);
    });
});
