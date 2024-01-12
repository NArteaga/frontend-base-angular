import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitacoraModal } from './bitacora.component';

describe('BitacoraModal', () => {
  let component: BitacoraModal;
  let fixture: ComponentFixture<BitacoraModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BitacoraModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BitacoraModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
