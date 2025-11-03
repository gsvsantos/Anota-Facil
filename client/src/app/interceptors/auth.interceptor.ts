import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NotificacaoService } from '../services/notificacao.service';

export const authInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const notificacaoService = inject(NotificacaoService);
  const router = inject(Router);

  const accessToken = authService.accessTokenSubject$.getValue();

  if (accessToken) {
    const requisicaoClonada = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken.chave}`),
    });

    return next(requisicaoClonada).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          notificacaoService.erro('Autenticação expirada. Faça o login novamente!', 'OK');
          authService.accessTokenSubject$.next(undefined);
          void router.navigate(['/auth', 'login']);
        }

        return throwError(() => err);
      }),
    );
  }

  return next(req);
};
