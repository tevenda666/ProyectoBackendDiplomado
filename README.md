# ProyectoBackendDiplomado

Este proyecto usa Express, TypeScript y MongoDB (mongoose).

Requisitos:
- Node.js v22.17.0 (según indicado)
- MongoDB (local o remoto)

Instalación (PowerShell):

```powershell
# instalar dependencias
npm install

# crear archivo .env basado en .env.example y ajustar MONGO_URI
copy .env.example .env
```

Comandos útiles (PowerShell):

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

Archivo de ejemplo para variables de entorno: `.env.example`.

Servidor de ejemplo en `src/index.ts`.