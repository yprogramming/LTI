import { TestBed, inject } from '@angular/core/testing';

import { ShelterService } from './shelter.service';

describe('ShelterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShelterService]
    });
  });

  it('should be created', inject([ShelterService], (service: ShelterService) => {
    expect(service).toBeTruthy();
  }));
});
