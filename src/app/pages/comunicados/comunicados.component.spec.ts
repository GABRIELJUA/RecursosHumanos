import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComunicadosComponent } from './comunicados.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ComunicadoService } from '../../services/comunicado.service';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('ComunicadosComponent', () => {

  let component: ComunicadosComponent;
  let fixture: ComponentFixture<ComunicadosComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let api: jasmine.SpyObj<ComunicadoService>;
  let router: Router;

  beforeEach(async () => {

    const authSpy = jasmine.createSpyObj('AuthService', ['getMe']);
    const apiSpy = jasmine.createSpyObj('ComunicadoService', [
      'getAll',
      'create',
      'update',
      'delete'
    ]);

    // 🔥 valores por defecto seguros
    authSpy.getMe.and.returnValue(of({ rol: 'ADMIN' }));
    apiSpy.getAll.and.returnValue(of([]));
    apiSpy.create.and.returnValue(of({}));
    apiSpy.update.and.returnValue(of({}));
    apiSpy.delete.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        ComunicadosComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ComunicadoService, useValue: apiSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComunicadosComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    api = TestBed.inject(ComunicadoService) as jasmine.SpyObj<ComunicadoService>;
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
    spyOn(window, 'confirm').and.returnValue(true);
  });

  // ✅ 1
  it('Debe inicializar correctamente el componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // ✅ 2 Permisos ADMIN
  it('Debe asignar correctamente permisos según el rol ADMIN', () => {
    fixture.detectChanges();
    expect(component.canEdit).toBeTrue();
    expect(component.canDelete).toBeTrue();
  });

  // ✅ 3 Redirige si falla auth
  it('Debe redirigir al inicio de sesión cuando falla la verificación de autenticación', () => {

    authService.getMe.and.returnValue(
      throwError(() => new Error('Error'))
    );

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  // ✅ 4 Carga comunicados
  it('Debe cargar el listado de comunicados desde el servicio', () => {

    const fakeData = [{ id_comunicado: 1, titulo: 'Test' }];
    api.getAll.and.returnValue(of(fakeData));

    fixture.detectChanges();

    expect(component.comunicados.length).toBe(1);
    expect(component.loading).toBeFalse();
  });

  // ✅ 5 Crear comunicado
  it('Debe registrar un nuevo comunicado correctamente', () => {

    fixture.detectChanges();

    component.editando = false;
    component.form = {
      titulo: 'Nuevo',
      contenido: 'Contenido',
      fecha_publicacion: '2024-01-01'
    };

    component.guardar();

    expect(api.create).toHaveBeenCalled();
  });

  // ✅ 6 Editar comunicado
  it('Debe actualizar un comunicado en modo edición', () => {

    fixture.detectChanges();

    component.editando = true;
    component.idEditando = 1;

    component.form = {
      titulo: 'Editado',
      contenido: 'Contenido',
      fecha_publicacion: '2024-01-01'
    };

    component.guardar();

    expect(api.update).toHaveBeenCalledWith(1, jasmine.any(FormData));
  });

  // ✅ 7 Eliminar comunicado
  it('Debe permitir eliminar un comunicado cuando el usuario es ADMIN', () => {

    fixture.detectChanges();

    component.eliminar(1);

    expect(api.delete).toHaveBeenCalledWith(1);
  });

  // ✅ 8 Bloquear eliminar si no es ADMIN
  it('No debe permitir eliminar comunicados si el usuario no es ADMIN', () => {

    component.canDelete = false;

    component.eliminar(1);

    expect(api.delete).not.toHaveBeenCalled();
  });

  // ✅ 9 Helpers archivo
  it('Debe identificar correctamente el tipo de archivo adjunto', () => {
    expect(component.getTipoArchivo('test.pdf')).toBe('pdf');
    expect(component.getTipoArchivo('foto.png')).toBe('image');
    expect(component.getTipoArchivo('doc.docx')).toBe('file');
  });

});