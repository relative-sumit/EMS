import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../../services/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './display.component.html',
  styleUrl: './display.component.css'
})
export class DisplayComponent implements OnInit{
  employee: any;
  constructor(private employeeService: EmployeeService, private router: Router){}
  ngOnInit(): void {
    this.employeeService.employeeInfo
    .subscribe(
      data=>{
        this.employee = data
        // console.log(this.employee)
      }
    )
  }

  navbarListItem = [
    {
      number: 1,
      name: 'profile',
      link: 'admin/update-employee/profile',
    },
    {
      number: 2,
      name: 'personal',
      link: 'admin/update-employee/personal',
    },
    {
      number: 3,
      name: 'skillset',
      link: 'admin/update-employee/skillset',
    },
  ];

  setActiveItem(itemName: string) {
    // Simulate setting employee info for demonstration purposes
    this.employeeService.setEmployeeInfo(this.employee);
    
    // Find the navigation item based on the provided itemName
    const item = this.navbarListItem.find(nav => nav.name === itemName);
    
    // If the item is found, navigate to the specified link
    if (item) {
      this.router.navigate([item.link]);
    }
  }
}
