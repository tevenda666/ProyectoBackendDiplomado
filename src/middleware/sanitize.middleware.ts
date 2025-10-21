import { NextFunction, Request, Response } from 'express';

function escapeHtml(str: string) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function sanitizeObject(obj: any, depth = 0): any {
    if (depth > 10) return {};
    if (Array.isArray(obj)) return obj.map((v: any) => sanitizeObject(v, depth + 1));
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string') {

        const withoutScripts = obj.replace(/<script.*?>.*?<\/script>/gi, '');
        return escapeHtml(withoutScripts);
    }
    if (typeof obj !== 'object') return obj;

    const clean: Record<string, any> = {};
    for (const key of Object.keys(obj)) {

        if (key.startsWith('$') || key.includes('.')) continue;

        const safeKey = escapeHtml(key);
        clean[safeKey] = sanitizeObject(obj[key], depth + 1);
    }
    return clean;
}

export function sanitizeMiddleware(req: Request, _res: Response, next: NextFunction) {
    try {
        if (req.body) req.body = sanitizeObject(req.body);
        if (req.query) req.query = sanitizeObject(req.query);
        if (req.params) req.params = sanitizeObject(req.params);
    } catch (err) {

        console.warn('Sanitize middleware error:', err);
    }
    return next();
}

export default sanitizeMiddleware;
