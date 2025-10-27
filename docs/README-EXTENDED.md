Docker y despliegue

- El repositorio incluye un `Dockerfile` multi-stage.
- GitHub Actions (`.github/workflows/docker-image.yml`) construye y publica la imagen en GHCR cuando se hace push a `main`. Asegúrate de agregar el secret `CR_PAT` (Personal Access Token con scope `write:packages`) en Settings → Secrets si quieres permitir que Actions publique la imagen.
- Para ejecutar la imagen publicada localmente:

```powershell

# Descargar la imagen
docker pull ghcr.io/tevenda666/proyectobackenddiplomado:latest

# Ejecutar la imagen con las variables de entorno desde un archivo .env
docker run --name proyecto-backend -d --env-file .env -p 3000:3000 ghcr.io/tevenda666/proyectobackenddiplomado:latest
```

Documentación de endpoints

- `docs/endpoints.txt` con ejemplos de uso (curl/Postman) para todos los endpoints principales.
