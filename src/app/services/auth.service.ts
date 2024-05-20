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
  query EmployeeInfoById($UserId: String) {
    employeeInfoById(UserId: $UserId) {
      _id
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
      Assets {
        _id
        AssetName
        AssetModel
        AssetType
        Memory
        Processor
        OperatingSystem
        Warranty
        AssetTag
        SerialNumber
        AssignTo
        AssignDate
        DischargeDate
        Description
        Addon
        IsWorkable
        CreatedBy
        CreatedDate
        UpdatedBy
        UpdatedDate
        IsActive
        IsDeleted
        Message
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
const GET_ALL_EMPLOYEES_INFO = gql`
  query {
    employeeInfo {
      _id
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
  mutation UpdateEmployeeInfo(
    $UserId: String!
    $Username: String!
    $input: EmployeeInfoInput!
  ) {
    updateEmployeeInfo(UserId: $UserId, Username: $Username, input: $input) {
      FirstName
      LastName
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private encrDcrp: EncryptingDecryptingService,
    private apollo: Apollo,
    private router: Router
  ) {}

  isLoggedin() {
    const res = sessionStorage.getItem('token');
    let resBool = false;
    if (res !== '' && res !== null) {
      resBool = true;
    }
    return resBool;
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

  getEmployeeInfo(userId: string): Observable<any> {
    return this.apollo
      .watchQuery<any>({
        query: GET_EMPLOYEE_INFO,
        variables: {
          UserId: userId,
        },
      })
      .valueChanges.pipe(map((info) => info.data.employeeInfoById));
  }

  getAllEmployeesInfo() {
    return this.apollo
      .watchQuery<any>({
        query: GET_ALL_EMPLOYEES_INFO,
      })
      .valueChanges.pipe(map((info) => info.data.employeeInfo));
  }

  updateEmployeeInfo(UserId: String, Username: string, input: any) {
    return this.apollo.mutate<any>({
      mutation: UPDATE_EMPLOYEE_INFO,
      variables: {
        UserId: UserId,
        Username: Username,
        input: input,
      },
    });
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
