import { TestBed, inject } from '@angular/core/testing';

import { AttractionsService } from './attractions.service';

describe('AttractionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttractionsService]
    });
  });

  it('should be created', inject([AttractionsService], (service: AttractionsService) => {
    expect(service).toBeTruthy();
  }));
});
