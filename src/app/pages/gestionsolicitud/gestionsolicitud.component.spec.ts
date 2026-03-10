import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionsolicitudComponent } from './gestionsolicitud.component';
import { VacacionesAdminService } from '../../services/vacaciones-admin.service';
import { of, throwError } from 'rxjs';

describe('GestionsolicitudComponent', () => {

  let component: GestionsolicitudComponent;
  let fixture: ComponentFixture<GestionsolicitudComponent>;
  let vacacionesService: jasmine.SpyObj<VacacionesAdminService>;

  const mockSolicitudes = [
    {
      num_nomina: '1234',
      empleado: 'Juan Pérez',
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-01-05',
      motivo: 'Vacaciones',
      creado_en: new Date().toISOString()
    },
    {
      num_nomina: '5678',
      empleado: 'Ana López',
      fecha_inicio: '2025-02-01',
      fecha_fin: '2025-02-03',
      motivo: '',
      creado_en: new Date().toISOString()
    }
  ];

  beforeEach(async () => {

    const spy = jasmine.createSpyObj('VacacionesAdminService', [
      'getSolicitudes'
    ]);

    spy.getSolicitudes.and.returnValue(of(mockSolicitudes));

    await TestBed.configureTestingModule({
      imports: [GestionsolicitudComponent],
      providers: [
        { provide: VacacionesAdminService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GestionsolicitudComponent);
    component = fixture.componentInstance;
    vacacionesService = TestBed.inject(VacacionesAdminService) as jasmine.SpyObj<VacacionesAdminService>;

    fixture.detectChanges();
  });

  it('Debe inicializar correctamente el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe cargar correctamente las solicitudes en la inicialización', () => {
    expect(vacacionesService.getSolicitudes).toHaveBeenCalled();
    expect(component.solicitudes.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('Debe aplicar filtro por número de nómina', () => {
    component.searchNomina = '1234';
    component.aplicarFiltros();
    expect(component.solicitudesFiltradas.length).toBe(1);
  });

  it('Debe cambiar el tipo de filtro correctamente', () => {
    component.setFiltro('todas');
    expect(component.filtro).toBe('todas');
  });

  it('Debe calcular correctamente la cantidad de días solicitados', () => {
    const dias = component.calcularDias('2025-01-01', '2025-01-05');
    expect(dias).toBe(5);
  });

  it('Debe manejar adecuadamente errores durante la carga de solicitudes', () => {

    vacacionesService.getSolicitudes.and.returnValue(
      throwError(() => new Error('Error'))
    );

    const newFixture = TestBed.createComponent(GestionsolicitudComponent);
    const newComponent = newFixture.componentInstance;

    newFixture.detectChanges();

    expect(newComponent.loading).toBeFalse();
  });

});