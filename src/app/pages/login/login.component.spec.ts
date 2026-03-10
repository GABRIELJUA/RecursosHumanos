import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('Pruebas unitarias del componente LoginComponent', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {

    const authSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  // 1
  it('Debe inicializar correctamente el componente de inicio de sesión', () => {
    expect(component).toBeTruthy();
  });

  // 2
  it('No debe ejecutar el método de autenticación cuando el formulario es inválido', () => {
    component.onSubmit();
    expect(authService.login).not.toHaveBeenCalled();
  });

  // 3 ADMIN
  it('Debe redirigir al panel administrativo cuando el usuario tiene rol ADMIN', () => {

    authService.login.and.returnValue(of({
      user: { rol: 'ADMIN' }
    }));

    component.loginForm.setValue({
      num_nomina: '123',
      password: '1234',
      rememberMe: false
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({
      num_nomina: '123',
      password: '1234'
    });

    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
    expect(component.isLoading).toBeFalse();
  });

  // 4 EMPLEADO
  it('Debe redirigir al panel de empleado cuando el usuario tiene rol EMPLEADO', () => {

    authService.login.and.returnValue(of({
      user: { rol: 'EMPLEADO' }
    }));

    component.loginForm.setValue({
      num_nomina: '123',
      password: '1234',
      rememberMe: false
    });

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/employee']);
  });

  // 5 Error backend
  it('Debe mostrar un mensaje de error cuando el servidor responde con credenciales inválidas', () => {

    authService.login.and.returnValue(
      throwError(() => ({
        status: 401,
        error: { message: 'Credenciales inválidas' }
      }))
    );

    component.loginForm.setValue({
      num_nomina: '123',
      password: 'wrong',
      rememberMe: false
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Credenciales inválidas');
    expect(component.isLoading).toBeFalse();
  });

  // 6 Error servidor apagado
  it('Debe mostrar un mensaje de error de conexión cuando el servidor no responde (status 0)', () => {

    authService.login.and.returnValue(
      throwError(() => ({
        status: 0
      }))
    );

    component.loginForm.setValue({
      num_nomina: '123',
      password: '1234',
      rememberMe: false
    });

    component.onSubmit();

    expect(component.errorMessage)
      .toBe('No se pudo conectar al servidor. Intenta más tarde.');
  });

});