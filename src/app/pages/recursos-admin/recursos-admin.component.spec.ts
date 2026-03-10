import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosAdminComponent } from './recursos-admin.component';

describe('RecursosAdminComponent', () => {
  let component: RecursosAdminComponent;
  let fixture: ComponentFixture<RecursosAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecursosAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecursosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
