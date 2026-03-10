import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { of, throwError, Observable } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('Pruebas unitarias del roleGuard (Control de Acceso Basado en Roles)', () => {

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {

    authServiceSpy = jasmine.createSpyObj('AuthService', ['checkAuth']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

  });

  function executeGuard(routeData: any): Observable<boolean> {
    const route = { data: routeData } as ActivatedRouteSnapshot;

    return TestBed.runInInjectionContext(() =>
      roleGuard(route, {} as any)
    ) as Observable<boolean>;
  }

  // 1️⃣ Permitir acceso
  it('Debe permitir el acceso cuando el rol del usuario está autorizado', (done) => {

    authServiceSpy.checkAuth.and.returnValue(
      of({ rol: 'ADMIN' })
    );

    executeGuard({ roles: ['ADMIN', 'EMPLEADO'] }).subscribe(result => {

      expect(result).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
      done();

    });

  });

  // 2️⃣ Denegar acceso por rol incorrecto
  it('Debe denegar el acceso y redirigir al login cuando el rol no está autorizado', (done) => {

    authServiceSpy.checkAuth.and.returnValue(
      of({ rol: 'EMPLEADO' })
    );

    executeGuard({ roles: ['ADMIN'] }).subscribe(result => {

      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      done();

    });

  });

  // 3️⃣ Error en autenticación
  it('Debe redirigir al login cuando ocurre un error en la verificación de autenticación', (done) => {

    authServiceSpy.checkAuth.and.returnValue(
      throwError(() => new Error('Error'))
    );

    executeGuard({ roles: ['ADMIN'] }).subscribe(result => {

      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      done();

    });

  });

});