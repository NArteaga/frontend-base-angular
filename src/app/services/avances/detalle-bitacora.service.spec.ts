import { TestBed } from '@angular/core/testing';

import { DetalleBitacoraService } from './detalle-bitacora.service';

describe('DetalleBitacoraService', () => {
  let service: DetalleBitacoraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleBitacoraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
