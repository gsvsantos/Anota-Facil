import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const usuarioAutenticadoGuard: CanActivateFn = (): Observable<true | UrlTree> => {
  const authService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.accessToken$.pipe(
    map((token) => (token ? true : router.createUrlTree(['/auth/login']))),
  );
};
