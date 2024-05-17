import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';


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

  constructor(private apollo: Apollo) { }

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
