import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuzonComponent } from './buzon.component';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('BuzonComponent', () => {

  let component: BuzonComponent;
  let fixture: ComponentFixture<BuzonComponent>;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {

    httpSpy = jasmine.createSpyObj('HttpClient', ['post']);

    await TestBed.configureTestingModule({
      imports: [BuzonComponent],
      providers: [
        { provide: HttpClient, useValue: httpSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BuzonComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('Debe inicializar correctamente el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe enviar una sugerencia correctamente al servidor', () => {

    httpSpy.post.and.returnValue(of({}));

    component.comentario = 'Comentario prueba';

    component.enviarMensaje();

    expect(httpSpy.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/sugerencias',
      jasmine.any(FormData)
    );

    expect(component.toastType).toBe('success');
    expect(component.comentario).toBe('');
    expect(component.isSending).toBeFalse();
  });

  it('Debe manejar adecuadamente errores durante el envío de la sugerencia', () => {

    httpSpy.post.and.returnValue(
      throwError(() => new Error('Error'))
    );

    component.comentario = 'Comentario prueba';

    component.enviarMensaje();

    expect(httpSpy.post).toHaveBeenCalled();

    expect(component.toastType).toBe('error');
    expect(component.isSending).toBeFalse();
  });

});