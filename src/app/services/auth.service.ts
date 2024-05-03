import { Injectable } from '@angular/core';
import { EncryptingDecryptingService } from './encrypting-decrypting.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = 'http://localhost:3000/graphql';

  constructor(private encrDcrp: EncryptingDecryptingService) {}

  isLoggedin() {
    return sessionStorage.getItem('token');
  }

  storeSession(key: string, data: string) {
    const dataToStore = this.encrDcrp.encrypt(data);
    sessionStorage.setItem(key, dataToStore);
  }
}
