import { TestBed, inject } from '@angular/core/testing';

import { LoginedService } from './logined.service';

describe('LoginedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginedService]
    });
  });

  it('should be created', inject([LoginedService], (service: LoginedService) => {
    expect(service).toBeTruthy();
  }));
});
