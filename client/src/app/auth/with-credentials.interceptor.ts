/**
 * File: with-credentials.interceptor.ts
 * Description: Marks every outgoing HttpClient request as withCredentials
 * so the browser sends and stores the server's session cookie.
 */

import { HttpInterceptorFn } from '@angular/common/http';

export const withCredentialsInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req.clone({ withCredentials: true }));
};
