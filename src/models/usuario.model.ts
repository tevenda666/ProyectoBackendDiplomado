import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUsuario {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUsuarioDocument extends IUsuario, Document { }

const UsuarioSchema = new mongoose.Schema<IUsuarioDocument>(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },
        apellido: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const UsuarioModel: Model<IUsuarioDocument> = (mongoose.models.Usuario as Model<IUsuarioDocument>) || mongoose.model<IUsuarioDocument>('Usuario', UsuarioSchema);

export default UsuarioModel;