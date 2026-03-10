import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService, AuthUser } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = (route.data?.['roles'] as string[] | undefined) ?? [];

  return authService.checkAuth().pipe(
    map((user: AuthUser) =>
      allowedRoles.length === 0 || allowedRoles.includes(user.rol)
        ? true
        : router.createUrlTree(['/login'])
    ),
    catchError(() => of(router.createUrlTree(['/login'])))
  );
};

