import { TestBed, inject } from '@angular/core/testing';

import { KampfTalentService } from './kampf-talent.service';

describe('KampfTalentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KampfTalentService]
    });
  });

  it('should be created', inject([KampfTalentService], (service: KampfTalentService) => {
    expect(service).toBeTruthy();
  }));
});
