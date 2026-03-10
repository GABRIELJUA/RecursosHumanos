import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BibliotecaPublicaComponent } from './biblioteca-publica.component';
import { LibraryService } from '../../services/library.service';
import { DomSanitizer } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

describe('BibliotecaPublicaComponent', () => {

  let component: BibliotecaPublicaComponent;
  let fixture: ComponentFixture<BibliotecaPublicaComponent>;
  let libraryService: jasmine.SpyObj<LibraryService>;

  const mockDocs = [
    {
      titulo: 'Manual RH',
      archivo_url: '/uploads/manual.pdf',
      categoria: 'Reglamento',
      fecha_subida: new Date().toISOString()
    }
  ];

  beforeEach(async () => {

    const librarySpy = jasmine.createSpyObj('LibraryService', ['getPublic']);
    librarySpy.getPublic.and.returnValue(of(mockDocs));

    await TestBed.configureTestingModule({
      imports: [BibliotecaPublicaComponent],
      providers: [
        { provide: LibraryService, useValue: librarySpy },
        { provide: DomSanitizer, useValue: {} }
      ]
    })
      .overrideComponent(BibliotecaPublicaComponent, {
        set: { template: '' }   // 🔥 CLAVE
      })
      .compileComponents();

    fixture = TestBed.createComponent(BibliotecaPublicaComponent);
    component = fixture.componentInstance;
    libraryService = TestBed.inject(LibraryService) as jasmine.SpyObj<LibraryService>;

    fixture.detectChanges();
  });

  it('Debe inicializar correctamente el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe cargar correctamente los documentos en la inicialización', () => {
    expect(libraryService.getPublic).toHaveBeenCalled();
    expect(component.documentos.length).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('Debe manejar adecuadamente errores durante la carga de documentos', () => {

    libraryService.getPublic.and.returnValue(
    throwError(() => new Error('Error'))
  );

  const newFixture = TestBed.createComponent(BibliotecaPublicaComponent);
  const newComponent = newFixture.componentInstance;

  newFixture.detectChanges();

  expect(newComponent.loading).toBeFalse();
});

it('Debe identificar correctamente archivos de tipo PDF', () => {
  expect(component.getTipoArchivo('/archivo.pdf')).toBe('pdf');
});

it('Debe identificar correctamente archivos de tipo imagen', () => {
  expect(component.getTipoArchivo('/imagen.jpg')).toBe('image');
});

it('Debe retornar el ícono correspondiente para archivos DOCX', () => {
  expect(component.getIconoArchivo('/archivo.docx'))
    .toBe('assets/icon/oficina.png');
});

});