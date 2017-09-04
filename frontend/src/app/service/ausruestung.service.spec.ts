import { TestBed, inject } from '@angular/core/testing';

import { AusruestungService } from './ausruestung.service';

describe('AusruestungService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AusruestungService]
    });
  });

  it('should be created', inject([AusruestungService], (service: AusruestungService) => {
    expect(service).toBeTruthy();
  }));
});
