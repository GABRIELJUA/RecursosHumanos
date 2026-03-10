import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionsugerenciasComponent } from './gestionsugerencias.component';
import { SugerenciasService } from '../../services/sugerencias.service';
import { of, throwError } from 'rxjs';

describe('GestionsugerenciasComponent', () => {

  let component: GestionsugerenciasComponent;
  let fixture: ComponentFixture<GestionsugerenciasComponent>;
  let sugerenciasService: jasmine.SpyObj<SugerenciasService>;

  beforeEach(async () => {

    const sugerenciasSpy = jasmine.createSpyObj('SugerenciasService', [
      'getAll'
    ]);

    // 🔥 valor por defecto seguro
    sugerenciasSpy.getAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [GestionsugerenciasComponent],
      providers: [
        { provide: SugerenciasService, useValue: sugerenciasSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GestionsugerenciasComponent);
    component = fixture.componentInstance;
    sugerenciasService = TestBed.inject(SugerenciasService) as jasmine.SpyObj<SugerenciasService>;
  });

  // ✅ 1
  it('Debe crearse el componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // ✅ 2 Carga sugerencias correctamente
  it('Debe cargar sugerencias', () => {

    const fakeData = [
      {
        id_sugerencia: 1,
        comentario: 'Prueba',
        imagen: null,
        fecha: '2024-01-01'
      }
    ];

    sugerenciasService.getAll.and.returnValue(of(fakeData));

    fixture.detectChanges();

    expect(component.sugerencias.length).toBe(1);
    expect(component.loading).toBeFalse();
  });

  // ✅ 3 Maneja error
  it('Debe manejar error al cargar', () => {

    sugerenciasService.getAll.and.returnValue(
      throwError(() => new Error('Error'))
    );

    fixture.detectChanges();

    expect(component.loading).toBeFalse();
  });

  // ✅ 4 Abrir detalle
  it('Debe abrir detalle de sugerencia', () => {

    const sugerencia = {
      id_sugerencia: 1,
      comentario: 'Detalle',
      imagen: null,
      fecha: '2024-01-01'
    };

    component.abrirDetalle(sugerencia);

    expect(component.verSugerencia).toBeTrue();
    expect(component.sugerenciaSeleccionada).toEqual(sugerencia);
  });

  // ✅ 5 Cerrar detalle
  it('Debe cerrar detalle', () => {

    component.verSugerencia = true;
    component.sugerenciaSeleccionada = {
      id_sugerencia: 1,
      comentario: 'Test',
      imagen: null,
      fecha: '2024-01-01'
    };

    component.cerrarDetalle();

    expect(component.verSugerencia).toBeFalse();
    expect(component.sugerenciaSeleccionada).toBeNull();
  });

});