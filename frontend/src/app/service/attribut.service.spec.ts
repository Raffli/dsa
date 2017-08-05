import { TestBed, inject } from '@angular/core/testing';

import { AttributService } from './attribut.service';

describe('AttributService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttributService]
    });
  });

  it('should be created', inject([AttributService], (service: AttributService) => {
    expect(service).toBeTruthy();
  }));
});
