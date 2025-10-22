import mongoose from 'mongoose';

export type TelefonoTipo = 'personal' | 'oficina' | 'emergencia';

export interface TelefonoResponse {
    tipo: TelefonoTipo;
    numero: string;
}

export interface ContactoResponse {
    usuarioId: string;
    nombre: string;
    telefonos: TelefonoResponse[];
}

export default ContactoResponse;
