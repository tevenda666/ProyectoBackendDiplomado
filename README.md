# ProyectoBackendDiplomado

API REST en Node + TypeScript para gestionar Usuarios y Contactos (los Contactos pueden tener uno o más teléfonos).

Resumen

- Backend con Express + TypeScript + Mongoose (MongoDB).
- Validación con express-validator, sanitización y logging básico a `logs/services.log`.
- Tests con Vitest.
- Docker multi-stage y GitHub Actions para build/push a GitHub Container Registry (GHCR).

Requisitos

- Node.js (recomendado LTS reciente)
- MongoDB (local o remoto)

Instalación (PowerShell)

```powershell
# instalar dependencias (usa npm ci en CI)
npm install

# crear archivo .env basado en .env.example y ajustar MONGO_URI
copy .env.example .env
```

Comandos útiles (PowerShell)

```powershell
# modo desarrollo (recarga automática)
npm run dev

# compilar a JavaScript
npm run build

# iniciar en producción (después de build)
npm start

# lint
npm run lint

# formatear
npm run format
```

Nota: si usas Windows PowerShell y el comando `copy` no funciona, usa `cp` o copia el contenido manualmente.

Variables de entorno

- Usa `.env` para desarrollo. No incluyas `.env` en el repositorio ni en la imagen Docker.
- Variables comunes: `MONGO_URI`, `JWT_SECRET`, `BCRYPT_SALT_ROUNDS`.

Servidor

- El arranque principal está en `src/index.ts`.
