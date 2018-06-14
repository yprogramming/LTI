import { TestBed, inject } from '@angular/core/testing';

import { InternetService } from './internet.service';

describe('InternetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InternetService]
    });
  });

  it('should be created', inject([InternetService], (service: InternetService) => {
    expect(service).toBeTruthy();
  }));
});
