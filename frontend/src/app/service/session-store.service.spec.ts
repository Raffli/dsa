import { TestBed, inject } from '@angular/core/testing';

import { SessionStoreService } from './session-store.service';

describe('SessionStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionStoreService]
    });
  });

  it('should be created', inject([SessionStoreService], (service: SessionStoreService) => {
    expect(service).toBeTruthy();
  }));
});
