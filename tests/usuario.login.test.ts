import { describe, it, expect } from 'vitest';
import { validationResult } from 'express-validator';
import { usuarioLoginValidator } from '../src/validators/usuario.validator';

async function runValidatorsOnBody(body: any) {
    const req: any = { body, params: {}, query: {} };
    const chains = usuarioLoginValidator();
    for (const chain of chains) {

        await chain.run(req);
    }
    return validationResult(req);
}

describe('usuarioLoginValidator', () => {
    it('debe fallar con email inválido o password vacío', async () => {
        const bad = { email: 'no-email', password: '' };
        const result = await runValidatorsOnBody(bad);
        expect(result.isEmpty()).toBe(false);
        const errors = result.array();
        const fields = errors.map((e) => ((e as any).param ?? (e as any).path));
        expect(fields).toContain('email');
        expect(fields).toContain('password');
    });

    it('debe pasar con email y password válidos', async () => {
        const good = { email: 'juan@example.com', password: 'Secret123' };
        const result = await runValidatorsOnBody(good);
        expect(result.isEmpty()).toBe(true);
    });
});
