import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { EncryptingDecryptingService } from '../../../services/encrypting-decrypting.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSortModule, Sort } from '@angular/material/sort'
import { SearchPipe } from '../../../pipes/search.pipe';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, MatSortModule, SearchPipe],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.css'
})
export class EmployeeManagementComponent implements OnInit{
  encrptedUserId: any
  encryptedUserName: any
  _id:String = '';
  userId: string = '';
  userName: string = '';
  employeeInfo: any;
  count: number = 0;
  page: number = 1;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 20];
  searchText: any = '';
  // fullList: any;
  // users: any[] = [];

  constructor(
    private auth: AuthService, 
    private ed: EncryptingDecryptingService,
    private route: Router,
    private employeeService: EmployeeService,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.get();
    this.encryptedUserName = sessionStorage.getItem('username');
    this.userName = this.ed.decrypt(this.encryptedUserName);
    this.employeeService.employeeInfo
    .subscribe(
      (data)=>{
        console.log(data);
        // this._id = data._id
        // console.log(this._id);
      }
    )
  }


  get(){
    this.auth.getAllEmployeesInfo()
    .subscribe(
      (data)=>{
        // console.log(data);
        this.employeeInfo = data;
        // this.users = this.employeeInfo['data'];
        this.sortedData = this.employeeInfo;
    },error=>{
      console.error(error);
    });
  }

  tableDataChange(event: any){
    this.page = event;
    this.get();
  }
  tableSizeChange(event: any){
    this.tableSize = event.target.value;
    this.page = 1;
    this.get();
  }

  sortedData: any[] = [];
  sortData(sort: Sort){
    const employees = this.employeeInfo.slice();
    if(!sort.active || sort.direction === ''){
      this.sortedData = employees;
      return;
    }

    this.sortedData = employees.sort((a: any, b:any) => {
      const isAsc = sort.direction === 'asc';
      // console.log(sort.direction);
      switch (sort.active) {
        case 'FirstName':
          return compare(a.FirstName, b.FirstName, isAsc);
        case 'Email.CompanyMail':
          return compare(a.Email.CompanyMail, b.Email.CompanyMail, isAsc);
        case 'Department.DepartmentName':
          return compare(a.Department.DepartmentName, b.Department.DepartmentName, isAsc);
        case 'Designation':
          return compare(a.Designation, b.Designation, isAsc);
        case 'Gender':
          return compare(a.Gender, b.Gender, isAsc);
        default:
          return 0;
      }
    })
  }

  addEmployee(){
    this.route.navigate(['admin/add-employee']);
  }
  updateEmployee(employee: any){
    this.employeeService.setEmployeeInfo(employee);
    this.route.navigate(['admin/update-employee']);
  }
  deleteEmployee(employee: any){
    console.log(employee);
    this._id = employee._id;
    if(confirm("Are you sure you want to delete this item?")){
      this.employeeService.deleteEmployeeInfoById(this._id, this.userName, employee)
      .subscribe(
        data=>{
          console.log(data);
        }, error =>{
          console.error(error);
        }
      )
    }
    // location.reload();
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
