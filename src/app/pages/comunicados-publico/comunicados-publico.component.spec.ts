import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComunicadosPublicoComponent } from './comunicados-publico.component';
import { ComunicadoService } from '../../services/comunicado.service';
import { DomSanitizer } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

describe('Pruebas unitarias del componente ComunicadosPublicoComponent', () => {

  let component: ComunicadosPublicoComponent;
  let fixture: ComponentFixture<ComunicadosPublicoComponent>;

  let comunicadoSpy: jasmine.SpyObj<ComunicadoService>;
  let sanitizerSpy: jasmine.SpyObj<DomSanitizer>;

  beforeEach(async () => {

    comunicadoSpy = jasmine.createSpyObj('ComunicadoService', ['getPublicos']);
    sanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);

    await TestBed.configureTestingModule({
      imports: [ComunicadosPublicoComponent],
      providers: [
        { provide: ComunicadoService, useValue: comunicadoSpy },
        { provide: DomSanitizer, useValue: sanitizerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComunicadosPublicoComponent);
    component = fixture.componentInstance;
  });

  // 1
  it('Debe inicializar correctamente el componente de comunicados públicos', () => {

    comunicadoSpy.getPublicos.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  // 2
  it('Debe cargar correctamente los comunicados durante la inicialización (ngOnInit)', () => {

    const mockData = [
      { titulo: 'Comunicado 1', fecha_publicacion: new Date().toISOString() }
    ];

    comunicadoSpy.getPublicos.and.returnValue(of(mockData));

    fixture.detectChanges();

    expect(component.comunicados.length).toBe(1);
  });

  // 3
  it('Debe manejar adecuadamente errores durante la carga de comunicados', () => {

    spyOn(console, 'error');

    comunicadoSpy.getPublicos.and.returnValue(
      throwError(() => new Error('Error'))
    );

    fixture.detectChanges();

    expect(console.error).toHaveBeenCalled();
  });

  // 4
  it('Debe filtrar correctamente los comunicados correspondientes al día actual', () => {

    const hoy = new Date().toISOString();

    component.comunicados = [
      { fecha_publicacion: hoy },
      { fecha_publicacion: '2000-01-01' }
    ];

    component.filtro = 'hoy';

    const resultado = component.comunicadosFiltrados;

    expect(resultado.length).toBe(1);
  });

  // 5
  it('Debe determinar correctamente el tipo de archivo cuando corresponde a una imagen', () => {
    expect(component.getTipoArchivo('foto.jpg')).toBe('image');
  });

  // 6
  it('Debe determinar correctamente el tipo de archivo cuando corresponde a un documento PDF', () => {
    expect(component.getTipoArchivo('archivo.pdf')).toBe('pdf');
  });

});