import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleModal } from './detalle.component';

describe('DetalleModal', () => {
  let component: DetalleModal;
  let fixture: ComponentFixture<DetalleModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
