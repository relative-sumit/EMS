import { Injectable } from '@angular/core';
import { EncryptingDecryptingService } from './encrypting-decrypting.service';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';

const EMPLOYEE_LOGIN_QUERY = gql`
  query employeeLogin($UserName: String!, $Password: String!) {
    employeeLogin(UserName: $UserName, Password: $Password) {
      message
      status
      token
      userId
      role
      username
      errorMessage
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  role: string = '';
  constructor(
    private encrDcrp: EncryptingDecryptingService,
    private apollo: Apollo,
    private router: Router
  ) {}

  isLoggedin() {
    return sessionStorage.getItem('token');
  }

  setRole(role: string) {
    this.role = role;
  }

  getRole() {
    return this.role;
  }

  storeSession(key: string, data: string) {
    const dataToStore = this.encrDcrp.encrypt(data);
    sessionStorage.setItem(key, dataToStore);
  }

  login(userName: string, password: string): Observable<any> {
    return this.apollo
      .watchQuery<any>({
        query: EMPLOYEE_LOGIN_QUERY,
        variables: {
          UserName: userName,
          Password: password,
        },
      })
      .valueChanges.pipe(map((result) => result.data.employeeLogin));
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
