import { TestBed, inject } from '@angular/core/testing';

import { TransportationService } from './transportation.service';

describe('TransportationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransportationService]
    });
  });

  it('should be created', inject([TransportationService], (service: TransportationService) => {
    expect(service).toBeTruthy();
  }));
});
