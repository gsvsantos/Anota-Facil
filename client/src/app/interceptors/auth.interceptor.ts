import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  const accessToken = authService.accessTokenSubject$.getValue();

  if (accessToken) {
    const requisicaoClonada = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken.chave}`),
    });

    return next(requisicaoClonada);
  }

  return next(req);
};
