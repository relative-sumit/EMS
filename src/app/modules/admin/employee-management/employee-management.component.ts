import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { EncryptingDecryptingService } from '../../../services/encrypting-decrypting.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSortModule, Sort } from '@angular/material/sort'
import { SearchPipe } from '../../../pipes/search.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, MatSortModule, SearchPipe],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.css'
})
export class EmployeeManagementComponent implements OnInit{
  encrptedUserId: any
  userId: string = '';
  employeeInfo: any;
  count: number = 0;
  page: number = 1;
  tableSize: number = 1;
  tableSizes: any = [1, 2, 6];
  searchText: any = '';
  // fullList: any;
  // users: any[] = [];

  constructor(
    private auth: AuthService, 
    private ed: EncryptingDecryptingService,
    private route: Router
  ){}

  ngOnInit(): void {
    this.get();
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
        default:
          return 0;
      }
    })
  }
  updateEmployee(){
      this.route.navigate(['admin/update-employee']);
  }
  deleteEmployee(){

  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
