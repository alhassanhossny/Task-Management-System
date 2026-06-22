import { Request, Response, NextFunction } from 'express';

export function I18nMiddleware(req: Request, res: Response, next: NextFunction) {
  const acceptLanguage = req.headers['accept-language'] || process.env.DEFAULT_LANG || 'ar';
  const lang = acceptLanguage.startsWith('en') ? 'en' : 'ar';
  (req as any).lang = lang;
  next();
}
