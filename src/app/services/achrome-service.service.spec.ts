import { TestBed } from '@angular/core/testing';

import { AChromeServiceService } from './achrome-service.service';

describe('AChromeServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AChromeServiceService = TestBed.get(AChromeServiceService);
    expect(service).toBeTruthy();
  });
});
