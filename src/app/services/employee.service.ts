import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, throwError } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as usZipcodes from 'zipcodes';

const GET_EMPLOYEE_INFO_ID = gql`
query GetEmployeeInfoBy_Id($id: String) {
    getEmployeeInfoBy_Id(_id: $id) {
      _id
      FirstName
      MiddleName
      LastName
      EmployeeCode
      UserId {
        UserId
        FirstName
        LastName
        UserName
        Email
        Password
        Role
      }
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
        Country
      }
      dob
      doj
      doc
      Department {
        DepartmentName
        Description
        _id
      }
      SkillSet {
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
      AssetModel
      AssetType
      Memory
      Processor
      OperatingSystem
      WarrantyStart
      WarrantyExpire
      AssetTag
      SerialNumber
      AssignDate
      DischargeDate
      AssetPurchaseDate
      AssetCondition
      Cost
      Vendor
      Description
      CreatedBy
      CreatedDate
      UpdatedBy
      UpdatedDate
      IsActive
      IsDeleted
      }
      ManagerId {
        _id
        FirstName
        MiddleName
        LastName
        EmployeeCode
        Designation
      }
      TeamLead {
        _id
        FirstName
        MiddleName
        LastName
        EmployeeCode
        Designation
      }
      Designation
  }
}
`;
const GET_ALL_MANAGERS_INFO = gql`
query ManagerInfo {
  managerInfo {
    _id
    FirstName
    MiddleName
    LastName
    EmployeeCode
  }
}
`;
const GET_ALL_TEAMLEAD_INFO = gql`
query TeamLeadInfo {
  teamLeadInfo {
    _id
    FirstName
    MiddleName
    LastName
    EmployeeCode
  }
}    
`;

const UPDATE_EMPLOYEE_INFO = gql`
  mutation updateEmployeeInfoById($_id: String!, $Username: String!, $input: EmployeeInfoInput!) {
    updateEmployeeInfoById(_id: $_id, Username: $Username, input: $input) {
      _id
      FirstName
      MiddleName
      LastName
      EmployeeCode
      UserId {
        UserId
        FirstName
        LastName
        UserName
        Email
        Password
        Role
      }
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
        Country
      }
      dob
      doj
      doc
      Department {
        DepartmentName
        Description
        _id
      }
      SkillSet {
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
      AssetModel
      AssetType
      Memory
      Processor
      OperatingSystem
      WarrantyStart
      WarrantyExpire
      AssetTag
      SerialNumber
      AssignDate
      DischargeDate
      AssetPurchaseDate
      AssetCondition
      Cost
      Vendor
      Description
      CreatedBy
      CreatedDate
      UpdatedBy
      UpdatedDate
      IsActive
      IsDeleted
      }
      ManagerId {
        _id
        FirstName
        MiddleName
        LastName
        EmployeeCode
        Designation
      }
      TeamLead {
        _id
        FirstName
        MiddleName
        LastName
        EmployeeCode
        Designation
      }
      Designation
    }
  }
`;
const CREATE_EMPLOYEE_INFO = gql`
  mutation createEmployeeInfo($Username: String!, $input: EmployeeInfoInput!) {
    createEmployeeInfo(Username: $Username, input: $input) {
      FirstName
      LastName
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private apollo: Apollo, private http: HttpClient) { }

  private employeeSubject = new BehaviorSubject<any>('');
  employeeInfo = this.employeeSubject.asObservable();

  setEmployeeInfo(employee: any) {
    this.employeeSubject.next(employee);
  }

  updateEmployeeInfoById(_id: String, Username: String, input: any) {
    // console.log("from service","_id: ", _id, "Data: ", input)
    // console.log("Before: ", input);
    if (input.Department) {
      input.Department = input.Department.DepartmentName
    }
    if (input.ManagerId && typeof input.ManagerId === 'object') {
      input.ManagerId = input.ManagerId.EmployeeCode
    }
    if (input.TeamLead && typeof input.TeamLead === 'object') {
      input.TeamLead = input.TeamLead.EmployeeCode
    }
    console.log("InputData: ", input);
    return this.apollo.mutate<any>({
      mutation: UPDATE_EMPLOYEE_INFO,
      variables: {
        _id: _id,
        Username: Username,
        input: input
      }
    })
  }

  deleteEmployeeInfoById(_id: String, Username: String, input: any) {
    const modifiedInput = { ...input, IsDeleted: 1 }
    // console.log(modifiedInput);
    return this.apollo.mutate<any>({
      mutation: UPDATE_EMPLOYEE_INFO,
      variables: {
        _id: _id,
        Username: Username,
        input: {
          FirstName: modifiedInput.FirstName,
          MiddleName: modifiedInput.MiddleName,
          LastName: modifiedInput.LastName,
          EmployeeCode: modifiedInput.EmployeeCode,
          UserId: modifiedInput.UserId,
          Photo: modifiedInput.Photo,
          Gender: modifiedInput.Gender,
          Contact: {
            CountryCode: modifiedInput.Contact.CountryCode,
            Primary: modifiedInput.Contact.Primary,
            Emergency: modifiedInput.Contact.Emergency
          },
          Email: {
            CompanyMail: modifiedInput.Email.CompanyMail,
            PersonalMail: modifiedInput.Email.PersonalMail
          },
          Location: {
            Flat: modifiedInput.Location.Flat,
            Area: modifiedInput.Location.Area,
            Landmark: modifiedInput.Location.Landmark,
            Pincode: modifiedInput.Location.Pincode,
            City: modifiedInput.Location.City,
            State: modifiedInput.Location.State
          },
          dob: modifiedInput.dob,
          doj: modifiedInput.doj,
          doc: modifiedInput.doc,
          Department: {
            DepartmentId: modifiedInput.Department.DepartmentId,
            DepartmentName: modifiedInput.Department.DepartmentName
          },
          SkillSet: {
            EmployeeSkillsetId: modifiedInput.SkillSet.EmployeeSkillsetId,
            PrimarySkillset: modifiedInput.SkillSet.PrimarySkillset,
            SecondarySkillset: modifiedInput.SkillSet.SecondarySkillset,
            SkillLevel: modifiedInput.SkillSet.SkillLevel,
            Experience: modifiedInput.SkillSet.Experience,
            Certification: {
              CertificationName: modifiedInput.SkillSet.Certification.CertificationName,
              CertificationDate: modifiedInput.SkillSet.Certification.CertificationDate
            }
          },
          ManagerId: modifiedInput.ManagerId,
          Designation: modifiedInput.Designation,
          IsDeleted: modifiedInput.IsDeleted
        }
      }
    })
  }

  createEmployeeInfo(Username: String, input: any) {
    if (input.Department) {
      input.Department = input.Department.DepartmentName
    }
    // input.ManagerId = input.ManagerId[0].EmployeeCode
    // input.TeamLead = input.TeamLead[0].EmployeeCode
    console.log("from service", input)

    return this.apollo.mutate<any>({
      mutation: CREATE_EMPLOYEE_INFO,
      variables: {
        Username: Username,
        input: input
      }
    })
  }


  getEmployeeInfoById(_id: string){
    console.log("In service",_id);
    return this.apollo.watchQuery<any>({
      query: GET_EMPLOYEE_INFO_ID,
      variables: {
        id: _id
      }
    })
    .valueChanges.pipe(map((info)=> info.data.getEmployeeInfoBy_Id))
  }
  getAllManagers() {
    return this.apollo.watchQuery<any>({
      query: GET_ALL_MANAGERS_INFO
    })
      .valueChanges.pipe(map((info) => info.data.managerInfo));
  }
  getAllTeamLead() {
    return this.apollo.watchQuery<any>({
      query: GET_ALL_TEAMLEAD_INFO
    })
      .valueChanges.pipe(map((info) => info.data.teamLeadInfo));
  }
}
