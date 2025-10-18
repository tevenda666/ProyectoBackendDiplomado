import mongoose, { Document, Model } from 'mongoose';
import UsuarioModel, { IUsuarioDocument } from './usuario.model';

function arrayLimit(val: any[]) {
    return val.length <= 3;
}

export interface ITelefono {
    tipo: 'personal' | 'oficina' | 'emergencia';
    numero: string;
}

export interface IContacto {
    usuarioId: mongoose.Types.ObjectId | IUsuarioDocument;
    nombre: string;
    telefonos: ITelefono[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IContactoDocument extends IContacto, Document { }

const TelefonoSchema = new mongoose.Schema<ITelefono>(
    {
        tipo: {
            type: String,
            enum: ['personal', 'oficina', 'emergencia'],
            required: true
        },
        numero: {
            type: String,
            required: true
        }
    },
    { _id: false }
);

const ContactoSchema = new mongoose.Schema<IContactoDocument>(
    {
        usuarioId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true
        },
        nombre: {
            type: String,
            required: true,
            trim: true
        },
        telefonos: {
            type: [TelefonoSchema],
            validate: [arrayLimit, '{PATH} excede el número máximo de teléfonos permitidos (3)']
        }
    },
    { timestamps: true }
);

const ContactoModel: Model<IContactoDocument> = (mongoose.models.Contacto as Model<IContactoDocument>) || mongoose.model<IContactoDocument>('Contacto', ContactoSchema);

export default ContactoModel;
