import fs from 'fs';
import path from 'path';

const LOG_DIR = path.resolve(process.cwd(), 'logs');
const SERVICE_LOG = path.join(LOG_DIR, 'services.log');

// ensure log directory exists
try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
} catch (e) {
    // if creation fails, fallback to console only
    // eslint-disable-next-line no-console
    console.warn('No se pudo crear el directorio de logs:', e);
}

type LogLevel = 'info' | 'warn' | 'error';

function writeLog(level: LogLevel, message: string, meta?: Record<string, any>) {
    const entry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        meta: meta || undefined,
    };
    const line = JSON.stringify(entry) + '\n';
    // append asynchronously; ignore errors to avoid crashing the app
    fs.appendFile(SERVICE_LOG, line, (err) => {
        if (err) {
            // eslint-disable-next-line no-console
            console.error('Error escribiendo log:', err);
        }
    });
}

export function info(message: string, meta?: Record<string, any>) {
    // also mirror to console
    // eslint-disable-next-line no-console
    console.log(message, meta || '');
    writeLog('info', message, meta);
}

export function warn(message: string, meta?: Record<string, any>) {
    // eslint-disable-next-line no-console
    console.warn(message, meta || '');
    writeLog('warn', message, meta);
}

export function error(err: unknown, meta?: Record<string, any>) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error && err.stack ? err.stack : undefined;

    console.error(message, meta || '', stack || '');
    writeLog('error', message, { ...meta, stack });
}

export default {
    info,
    warn,
    error,
};
