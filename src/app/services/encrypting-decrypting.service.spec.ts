import { TestBed } from '@angular/core/testing';

import { EncryptingDecryptingService } from './encrypting-decrypting.service';

describe('EncryptingDecryptingService', () => {
  let service: EncryptingDecryptingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncryptingDecryptingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
