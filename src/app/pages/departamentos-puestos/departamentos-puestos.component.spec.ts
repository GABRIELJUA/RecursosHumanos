import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartamentosPuestosComponent } from './departamentos-puestos.component';

describe('DepartamentosPuestosComponent', () => {
  let component: DepartamentosPuestosComponent;
  let fixture: ComponentFixture<DepartamentosPuestosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartamentosPuestosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartamentosPuestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
