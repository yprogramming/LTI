import { TestBed, inject } from '@angular/core/testing';

import { UserGaurdService } from './user-gaurd.service';

describe('UserGaurdService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserGaurdService]
    });
  });

  it('should be created', inject([UserGaurdService], (service: UserGaurdService) => {
    expect(service).toBeTruthy();
  }));
});
