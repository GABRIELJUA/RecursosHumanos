import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeFormComponent } from './employee-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { EmployeeService } from '../../../services/employee.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('EmployeeFormComponent', () => {

  let component: EmployeeFormComponent;
  let fixture: ComponentFixture<EmployeeFormComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let employeeService: jasmine.SpyObj<EmployeeService>;
  let router: Router;

  beforeEach(async () => {

    const authSpy = jasmine.createSpyObj('AuthService', ['getMe']);
    const employeeSpy = jasmine.createSpyObj('EmployeeService', [
      'addEmployee',
      'updateEmployee',
      'getEmployeeById'
    ]);

    // 🔥 Valores por defecto seguros
    authSpy.getMe.and.returnValue(of({ rol: 'ADMIN' }));
    employeeSpy.addEmployee.and.returnValue(of({}));
    employeeSpy.updateEmployee.and.returnValue(of({}));
    employeeSpy.getEmployeeById.and.returnValue(of({
      id_empleado: 1,
      num_nomina: '1',
      rol: 'EMPLEADO',
      fecha_ingreso: '2024-01-01',
      puesto: '',
      departamento: '',
      nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      fecha_nacimiento: '2000-01-01',
      edad: '',
      sexo: '',
      estado_civil: '',
      nacionalidad: '',
      correo: '',
      telefono: '',
      domicilio: '',
      rfc: '',
      curp: '',
      nss: '',
      password: ''
    }));

    await TestBed.configureTestingModule({
      imports: [
        EmployeeFormComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: EmployeeService, useValue: employeeSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeFormComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    employeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
    spyOn(window, 'alert');
  });

  // ✅ 1
  it('Debe inicializar correctamente el componente de registro y edición', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // ✅ 2 Permisos ADMIN
  it('Debe validar permisos cuando el usuario tiene rol ADMIN', () => {
    fixture.detectChanges();
    expect(component.canRegister).toBeTrue();
    expect(component.canEdit).toBeTrue();
    expect(component.canChangeRole).toBeTrue();
  });

  // ✅ 3 Redirige si falla auth
  it('Debe redirigir al inicio de sesión cuando falla la verificación de autenticación', () => {

    authService.getMe.and.returnValue(
      throwError(() => new Error('Error'))
    );

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  // ✅ 4 Registro nuevo
  it('Debe registrar correctamente un nuevo empleado', () => {

    fixture.detectChanges();
    component.isEditing = false;

    component.onSave();

    expect(employeeService.addEmployee).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/employees']);
  });

  // ✅ 5 Actualizar empleado en edición
  it('Debe actualizar correctamente un empleado en modo edición', () => {

    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.paramMap, 'get').and.returnValue('1');

    component.isEditing = true;

    fixture.detectChanges();

    component.onSave();

    expect(employeeService.updateEmployee).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/employees']);
  });

  // ✅ 6 Cambio de pasos
  it('Debe gestionar correctamente la navegación entre pasos del formulario', () => {

    expect(component.step).toBe(1);

    component.nextStep();
    expect(component.step).toBe(2);

    component.prevStep();
    expect(component.step).toBe(1);
  });

});