import { TestBed, inject } from '@angular/core/testing';

import { KampfService } from './kampf.service';

describe('KampfService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KampfService]
    });
  });

  it('should be created', inject([KampfService], (service: KampfService) => {
    expect(service).toBeTruthy();
  }));
});
