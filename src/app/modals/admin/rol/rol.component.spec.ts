import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolModal } from './rol.component';

describe('RolModal', () => {
  let component: RolModal;
  let fixture: ComponentFixture<RolModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
