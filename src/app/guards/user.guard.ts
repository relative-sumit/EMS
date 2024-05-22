import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { EncryptingDecryptingService } from '../services/encrypting-decrypting.service';

export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const auth = inject(AuthService);
  const encrDcrp = inject(EncryptingDecryptingService);
  const role = encrDcrp.decrypt('' + sessionStorage.getItem('role'));
  if (auth.isLoggedin() && role === 'user') {
    return true;
  } else {
    alert("You are not authorized to visit this page.")
    router.navigate([''])
    return false;
  }
};
