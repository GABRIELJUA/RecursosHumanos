import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeListComponent } from './employee-list.component';
import { EmployeeService } from '../../../services/employee.service';
import { AuthService } from '../../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('EmployeeListComponent', () => {

  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;

  let employeeServiceSpy: jasmine.SpyObj<EmployeeService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {

    employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getEmployees']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getMe']);

    await TestBed.configureTestingModule({
      imports: [
        EmployeeListComponent,
        RouterTestingModule   // 🔥 ESTA LÍNEA SOLUCIONA TODO
      ],
      providers: [
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  // ✅ 1
  it('Debe inicializar correctamente el componente de listado de empleados', () => {

    authServiceSpy.getMe.and.returnValue(of({ rol: 'ADMIN' }));
    employeeServiceSpy.getEmployees.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  // ✅ 2
  it('Debe asignar permisos correctamente según el rol ADMIN_EDITOR', () => {

    component.currentUserRole = 'ADMIN_EDITOR';
    component.setPermissions();

    expect(component.canCreate).toBeFalse();
    expect(component.canEdit).toBeTrue();
  });

  // ✅ 3
  it('Debe cargar correctamente los empleados', () => {

    authServiceSpy.getMe.and.returnValue(of({ rol: 'ADMIN' }));

    employeeServiceSpy.getEmployees.and.returnValue(of([
      { rol: 'ADMIN', departamento: 'RH' },
      { rol: 'EMPLEADO', departamento: 'RH' },
      { rol: 'EMPLEADO', departamento: 'IT' }
    ] as any));

    fixture.detectChanges();

    expect(component.employees.length).toBe(2);
    expect(component.departamentos.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  // ✅ 4
  it('Debe manejar adecuadamente errores durante la carga de empleados', () => {

    authServiceSpy.getMe.and.returnValue(of({ rol: 'ADMIN' }));
    employeeServiceSpy.getEmployees.and.returnValue(
      throwError(() => new Error('Error'))
    );

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Error al cargar empleados');
    expect(component.loading).toBeFalse();
  });

  // ✅ 5
  it('Debe redirigir al inicio de sesión cuando falla la verificación de autenticación', () => {

    authServiceSpy.getMe.and.returnValue(
      throwError(() => new Error('No autorizado'))
    );

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

});