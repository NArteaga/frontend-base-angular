import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitucionPage } from './institucion.component';

describe('InstitucionPage', () => {
  let component: InstitucionPage;
  let fixture: ComponentFixture<InstitucionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitucionPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstitucionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
