import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as usZipcodes from 'zipcodes';


const UPDATE_EMPLOYEE_INFO = gql`
  mutation updateEmployeeInfoById($_id: String!, $Username: String!, $input: EmployeeInfoInput!) {
    updateEmployeeInfoById(_id: $_id, Username: $Username, input: $input) {
      FirstName
      LastName
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

  getLocation(postalCode: string): Observable<any> {
    if (/^\d{5}(-\d{4})?$/.test(postalCode)) {
      // US ZIP Code
      const location = usZipcodes.lookup(postalCode);
      if (location) {
        return of({ city: location.city, state: location.state});
      }
      return of(null);
    } 
    // else if (/^\d{6}$/.test(postalCode)) {
    //   // Indian PIN Code
    //   return this.http.get(`https://api.postalpincode.in/pincode/${postalCode}`).pipe(
    //     map((data: any) => {
    //       const postOffice = data[0]?.PostOffice[0];
    //       return {
    //         city: postOffice.District,
    //         state: postOffice.State,
    //         // country: 'IN'
    //       };
    //     }),
    //     catchError((error: HttpErrorResponse) => {
    //       let errorMessage = 'Unknown error';
    //       if (error.error instanceof ErrorEvent) {
    //         // Client-side errors
    //         errorMessage = `Error: ${error.error.message}`;
    //       } else {
    //         // Server-side errors
    //         errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    //       }
    //       console.error(errorMessage);
    //       return of(null);
    //     })
    //   );
    // }
    return of(null);
  }

  private employeeSubject = new BehaviorSubject<any>('');
  employeeInfo = this.employeeSubject.asObservable();

  setEmployeeInfo(employee: any){
    this.employeeSubject.next(employee);
  }

  updateEmployeeInfoById(_id: String, Username: String, input:any){
    // console.log("from service","_id: ", _id, "Data: ", input)
    return this.apollo.mutate<any>({
      mutation:UPDATE_EMPLOYEE_INFO,
      variables:{
        _id: _id,
        Username: Username,
        input: input
      }
    })
  }

  deleteEmployeeInfoById(_id: String, Username: String, input:any){
    const modifiedInput = {...input, IsDeleted: 1}
    // console.log(modifiedInput);
    return this.apollo.mutate<any>({
      mutation:UPDATE_EMPLOYEE_INFO,
      variables:{
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

  createEmployeeInfo(Username: String, input:any){
    // console.log("from service","_id: ", _id, "Data: ", input)
    return this.apollo.mutate<any>({
      mutation:CREATE_EMPLOYEE_INFO,
      variables:{
        Username: Username,
        input: input
      }
    })
  }
}
