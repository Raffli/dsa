import { TestBed, inject } from '@angular/core/testing';

import { HeldenService } from './helden.service';

describe('HeldenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeldenService]
    });
  });

  it('should be created', inject([HeldenService], (service: HeldenService) => {
    expect(service).toBeTruthy();
  }));
});
