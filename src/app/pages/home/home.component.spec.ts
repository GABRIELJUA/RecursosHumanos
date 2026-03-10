import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardService } from '../../services/dashboard.service';
import { of, throwError } from 'rxjs';

describe('Pruebas unitarias del componente HomeComponent', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let dashboardService: jasmine.SpyObj<DashboardService>;

  beforeEach(async () => {

    const dashboardSpy = jasmine.createSpyObj('DashboardService', [
      'getSummary',
      'getDistribucion'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: DashboardService, useValue: dashboardSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(DashboardService) as jasmine.SpyObj<DashboardService>;
  });

  // 1
  it('Debe inicializar correctamente el componente del dashboard administrativo', () => {
    expect(component).toBeTruthy();
  });

  // 2
  it('Debe cargar correctamente los datos de resumen y la distribución por departamento durante la inicialización', () => {

    dashboardService.getSummary.and.returnValue(of({
      empleados: 10,
      sugerencias: 5,
      comunicados: 3,
      vacaciones: 2
    }));

    dashboardService.getDistribucion.and.returnValue(of([
      { departamento: 'RH', total: 4 },
      { departamento: 'Ventas', total: 6 }
    ]));

    fixture.detectChanges(); // ejecuta ngOnInit

    expect(component.summary.empleados).toBe(10);
    expect(component.distribucionDepartamentos.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  // 3
  it('Debe manejar adecuadamente errores cuando falla la carga de la distribución por departamento', () => {

    dashboardService.getSummary.and.returnValue(of({
      empleados: 10,
      sugerencias: 5,
      comunicados: 3,
      vacaciones: 2
    }));

    dashboardService.getDistribucion.and.returnValue(
      throwError(() => new Error('Error'))
    );

    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('Error al cargar distribución');
  });

});