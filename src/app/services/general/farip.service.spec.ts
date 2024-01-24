import { TestBed } from '@angular/core/testing';

import { FaripService } from './farip.service';

describe('FaripService', () => {
  let service: FaripService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaripService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
