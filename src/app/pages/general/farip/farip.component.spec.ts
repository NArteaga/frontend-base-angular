import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaripComponent } from './farip.component';

describe('FaripComponent', () => {
  let component: FaripComponent;
  let fixture: ComponentFixture<FaripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaripComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FaripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
