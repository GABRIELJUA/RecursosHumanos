import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaAdminComponent } from './galeria-admin.component';

describe('GaleriaAdminComponent', () => {
  let component: GaleriaAdminComponent;
  let fixture: ComponentFixture<GaleriaAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaleriaAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GaleriaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
