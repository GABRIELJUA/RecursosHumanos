import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudVacacionesComponent } from './solicitud-vacaciones.component';
import { VacacionesService } from '../../services/vacaciones.service';
import { of, throwError } from 'rxjs';

describe('SolicitudVacacionesComponent', () => {

  let component: SolicitudVacacionesComponent;
  let fixture: ComponentFixture<SolicitudVacacionesComponent>;
  let vacacionesService: jasmine.SpyObj<VacacionesService>;

  beforeEach(async () => {

    const spy = jasmine.createSpyObj('VacacionesService', [
      'crearSolicitud'
    ]);

    spy.crearSolicitud.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [SolicitudVacacionesComponent],
      providers: [
        { provide: VacacionesService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudVacacionesComponent);
    component = fixture.componentInstance;
    vacacionesService = TestBed.inject(VacacionesService) as jasmine.SpyObj<VacacionesService>;
    fixture.detectChanges();
  });

  it('Debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('fechasValidas debe retornar false si fecha inicio es pasada', () => {
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);

    component.fecha_inicio = ayer.toISOString().split('T')[0];
    component.fecha_fin = component.fecha_inicio;

    expect(component.fechasValidas).toBeFalse();
  });

  it('fechasValidas debe retornar false si fecha fin < inicio', () => {
    component.fecha_inicio = '2025-12-10';
    component.fecha_fin = '2025-12-05';

    expect(component.fechasValidas).toBeFalse();
  });

  it('formularioValido debe ser true con datos correctos', () => {

    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);

    const pasado = new Date();
    pasado.setDate(pasado.getDate() + 3);

    component.fecha_inicio = mañana.toISOString().split('T')[0];
    component.fecha_fin = pasado.toISOString().split('T')[0];

    expect(component.formularioValido).toBeTrue();
  });

  it('Debe enviar solicitud correctamente', () => {

    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);

    const pasado = new Date();
    pasado.setDate(pasado.getDate() + 3);

    component.fecha_inicio = mañana.toISOString().split('T')[0];
    component.fecha_fin = pasado.toISOString().split('T')[0];
    component.motivo = 'Viaje';

    component.enviarSolicitud();

    expect(vacacionesService.crearSolicitud).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.toast.show).toBeTrue();
    expect(component.fecha_inicio).toBe('');
  });

  it('Debe manejar error al enviar solicitud', () => {

    vacacionesService.crearSolicitud.and.returnValue(
      throwError(() => new Error('Error'))
    );

    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);

    const pasado = new Date();
    pasado.setDate(pasado.getDate() + 3);

    component.fecha_inicio = mañana.toISOString().split('T')[0];
    component.fecha_fin = pasado.toISOString().split('T')[0];

    component.enviarSolicitud();

    expect(component.loading).toBeFalse();
    expect(component.toast.type).toBe('error');
  });

  it('No debe enviar si loading es true', () => {
    component.loading = true;
    component.enviarSolicitud();
    expect(vacacionesService.crearSolicitud).not.toHaveBeenCalled();
  });

});