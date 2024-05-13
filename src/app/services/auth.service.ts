import { Injectable } from '@angular/core';
import { EncryptingDecryptingService } from './encrypting-decrypting.service';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable, map } from 'rxjs';
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

const GET_EMPLOYEE_INFO = gql`
query($UserId:String){
  employeeInfoById(UserId: $UserId){
    FirstName
    MiddleName
    LastName
    EmployeeCode
    UserId
    Photo
    Gender
    Contact {
      CountryCode
      Primary
      Emergency
    }
    Email {
      CompanyMail
      PersonalMail
    }
    Location {
      Flat
      Area
      Landmark
      Pincode
      City
      State
    }
    dob
    doj
    doc
    Department {
      DepartmentId
      DepartmentName
    }
    SkillSet {
      EmployeeSkillsetId
      PrimarySkillset
      SecondarySkillset
      SkillLevel
      Experience
      Certification {
        CertificationName
        CertificationDate
      }
    }
    ManagerId
    Designation
    CreatedBy
    UpdatedBy
    IsActive
    IsDeleted
  }
}
`;

const UPDATE_EMPLOYEE_INFO = gql`
  mutation UpdateEmployeeInfo($UserId: String!, $input: EmployeeInfoInput!) {
    updateEmployeeInfo(UserId: $UserId, input: $input) {
      FirstName
      LastName
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

  getEmployeeInfo(userId: string): Observable<any>{
    return this.apollo
            .watchQuery<any>({
              query: GET_EMPLOYEE_INFO,
              variables: {
                UserId:userId
              },
            })
            .valueChanges.pipe(map((info)=> info.data.employeeInfoById));
  }
  updateEmployeeInfo(UserId: String, input:any){
    console.log("From Auth Service: ", input);
    return this.apollo.mutate<any>({
      mutation:UPDATE_EMPLOYEE_INFO,
      variables:{
        UserId: UserId,
        input: input
      }
    })
  }


  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
