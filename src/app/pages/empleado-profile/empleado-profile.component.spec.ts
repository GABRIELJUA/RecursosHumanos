import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmpleadoProfileComponent } from './empleado-profile.component';
import { EmpleadoService } from '../../services/empleado.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('EmpleadoProfileComponent', () => {

  let component: EmpleadoProfileComponent;
  let fixture: ComponentFixture<EmpleadoProfileComponent>;
  let empleadoService: jasmine.SpyObj<EmpleadoService>;

  beforeEach(async () => {

    const empleadoSpy = jasmine.createSpyObj('EmpleadoService', [
      'getMyProfile',
      'updateMyProfile'
    ]);

    // Valores por defecto seguros
    empleadoSpy.getMyProfile.and.returnValue(of({
      num_nomina: '1234',
      rol: 'EMPLEADO',
      fecha_ingreso: '2024-01-01',
      departamento: '',
      puesto: '',
      nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      fecha_nacimiento: '2000-01-01',
      edad: 25,
      sexo: '',
      estado_civil: '',
      nacionalidad: '',
      correo: 'test@test.com',
      telefono: '1234567890',
      domicilio: '',
      rfc: '',
      curp: '',
      nss: ''
    }));

    empleadoSpy.updateMyProfile.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [EmpleadoProfileComponent],
      providers: [
        { provide: EmpleadoService, useValue: empleadoSpy },
        { provide: ActivatedRoute, useValue: {} } // 🔥 solución
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmpleadoProfileComponent);
    component = fixture.componentInstance;
    empleadoService = TestBed.inject(EmpleadoService) as jasmine.SpyObj<EmpleadoService>;
  });

  it('Debe crearse el componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('Debe cargar perfil en ngOnInit', () => {
    fixture.detectChanges();
    expect(component.employee).toBeTruthy();
    expect(component.loading).toBeFalse();
  });

  it('Debe manejar error al cargar perfil', () => {
    empleadoService.getMyProfile.and.returnValue(
      throwError(() => new Error('Error'))
    );
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
  });

  it('Debe actualizar perfil correctamente', () => {
    fixture.detectChanges();
    component.isEditing = true;
    component.saveProfile();
    expect(empleadoService.updateMyProfile).toHaveBeenCalled();
    expect(component.isEditing).toBeFalse();
    expect(component.toast.show).toBeTrue();
  });

  it('Debe cancelar edición', () => {
    component.isEditing = true;
    component.cancelEdit();
    expect(component.isEditing).toBeFalse();
  });

  it('Debe mostrar toast', () => {
    component.toastMsg('Mensaje', 'info');
    expect(component.toast.show).toBeTrue();
    expect(component.toast.message).toBe('Mensaje');
  });

});