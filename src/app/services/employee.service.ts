import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor() { }

  private employeeSubject = new BehaviorSubject<any>('');
  employeeInfo = this.employeeSubject.asObservable();

  setEmployeeInfo(employee: any){
    this.employeeSubject.next(employee);
  }
}
