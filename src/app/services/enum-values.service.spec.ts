import { TestBed } from '@angular/core/testing';

import { EnumValuesService } from './enum-values.service';

describe('EnumValuesService', () => {
  let service: EnumValuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnumValuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
