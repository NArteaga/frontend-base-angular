import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitacoraPage } from './bitacora.component';

describe('ProyectosPage', () => {
  let component: BitacoraPage;
  let fixture: ComponentFixture<BitacoraPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BitacoraPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BitacoraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
