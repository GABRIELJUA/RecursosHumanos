import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BibliotecaComponent } from './biblioteca.component';
import { LibraryService } from '../../services/library.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('BibliotecaComponent', () => {

  let component: BibliotecaComponent;
  let fixture: ComponentFixture<BibliotecaComponent>;
  let libraryService: jasmine.SpyObj<LibraryService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    const librarySpy = jasmine.createSpyObj('LibraryService', [
      'getAll',
      'upload',
      'delete'
    ]);

    const authSpy = jasmine.createSpyObj('AuthService', [
      'getMe'
    ]);

    const routerSpy = jasmine.createSpyObj('Router', [
      'navigate'
    ]);

    librarySpy.getAll.and.returnValue(of([]));
    authSpy.getMe.and.returnValue(of({ rol: 'ADMIN' }));

    await TestBed.configureTestingModule({
      imports: [BibliotecaComponent],
      providers: [
        { provide: LibraryService, useValue: librarySpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BibliotecaComponent);
    component = fixture.componentInstance;

    libraryService = TestBed.inject(LibraryService) as jasmine.SpyObj<LibraryService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('Debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe cargar documentos en ngOnInit', () => {
    expect(authService.getMe).toHaveBeenCalled();
    expect(libraryService.getAll).toHaveBeenCalled();
  });

  it('Debe redirigir a login si falla auth', () => {

    authService.getMe.and.returnValue(
      throwError(() => new Error('No auth'))
    );

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('Debe asignar permisos ADMIN correctamente', () => {
    component.rolUsuario = 'ADMIN';
    component.setPermissions();

    expect(component.canUpload).toBeTrue();
    expect(component.canDelete).toBeTrue();
  });

  it('Debe asignar permisos ADMIN_EDITOR correctamente', () => {
    component.rolUsuario = 'ADMIN_EDITOR';
    component.setPermissions();

    expect(component.canUpload).toBeTrue();
    expect(component.canDelete).toBeFalse();
  });

  it('Debe bloquear eliminación si no es ADMIN', () => {
    component.rolUsuario = 'ADMIN_EDITOR';
    component.eliminar(1);

    expect(component.toast.type).toBe('error');
  });

  it('Debe activar confirmación al eliminar si es ADMIN', () => {
    component.rolUsuario = 'ADMIN';
    component.eliminar(5);

    expect(component.docEliminarId).toBe(5);
    expect(component.mostrarConfirmDelete).toBeTrue();
  });

  it('Debe confirmar eliminación correctamente', () => {

    component.docEliminarId = 10;
    libraryService.delete.and.returnValue(of({}));

    component.confirmarEliminar();

    expect(libraryService.delete).toHaveBeenCalledWith(10);
    expect(component.mostrarConfirmDelete).toBeFalse();
  });

  it('Debe subir documento correctamente', () => {

    libraryService.upload.and.returnValue(of({}));

    component.form.titulo = 'Manual';
    component.archivoSeleccionado = new File(['test'], 'test.pdf');

    component.subir();

    expect(libraryService.upload).toHaveBeenCalled();
    expect(component.mostrarSubir).toBeFalse();
  });

  it('Debe filtrar documentos correctamente', () => {

    component.documentos = [
      { titulo: 'Manual RH', categoria: 'Manual' },
      { titulo: 'Reglamento interno', categoria: 'Reglamento' }
    ];

    component.busqueda = 'manual';
    component.filtrar();

    expect(component.documentosFiltrados.length).toBe(1);
  });

});