import { TestBed } from '@angular/core/testing';

import { PideService } from './pide.service';

describe('PideService', () => {
  let service: PideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
