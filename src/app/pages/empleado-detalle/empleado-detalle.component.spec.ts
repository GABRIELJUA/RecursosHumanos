import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmpleadoDetalleComponent } from './empleado-detalle.component';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('EmpleadoDetalleComponent', () => {

  let component: EmpleadoDetalleComponent;
  let fixture: ComponentFixture<EmpleadoDetalleComponent>;

  let employeeServiceSpy: jasmine.SpyObj<EmployeeService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getEmployeeById']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EmpleadoDetalleComponent],
      providers: [
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'  // 👈 simulamos id = 1
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmpleadoDetalleComponent);
    component = fixture.componentInstance;
  });

  // ✅ 1
  it('Debe crearse el componente', () => {

    employeeServiceSpy.getEmployeeById.and.returnValue(of({} as any));

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  // ✅ 2
  it('Debe cargar empleado correctamente', () => {

    const mockEmployee = {
      id_empleado: 1,
      num_nomina: '123',
      rol: 'EMPLEADO',
      fecha_ingreso: '2020-01-01',
      puesto: 'Mesero',
      departamento: 'Servicio',
      nombre: 'Juan',
      apellido_paterno: 'Perez',
      apellido_materno: 'Lopez',
      fecha_nacimiento: '1990-01-01',
      edad: '34',
      sexo: 'M',
      estado_civil: 'Soltero',
      nacionalidad: 'Mexicana',
      correo: 'juan@test.com',
      telefono: '1234567890',
      domicilio: 'Calle 123',
      rfc: 'RFC123',
      curp: 'CURP123',
      nss: 'NSS123'
    };

    employeeServiceSpy.getEmployeeById.and.returnValue(of(mockEmployee));

    fixture.detectChanges();

    expect(component.employee).toEqual(mockEmployee);
    expect(component.loading).toBeFalse();
  });

  // ✅ 3
  it('Debe redirigir si ocurre error al cargar empleado', () => {

    spyOn(window, 'alert');

    employeeServiceSpy.getEmployeeById.and.returnValue(
      throwError(() => new Error('Error'))
    );

    fixture.detectChanges();

    expect(window.alert).toHaveBeenCalledWith('No se pudo cargar el empleado');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/employees']);
  });

});