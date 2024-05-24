import { Component, OnInit } from '@angular/core';
import { EnumValuesService } from '../../../services/enum-values.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-holiday',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './holiday.component.html',
  styleUrl: './holiday.component.css',
})
export class HolidayComponent implements OnInit {
  holidayList: any;
  constructor(private enumValues: EnumValuesService) {}
  ngOnInit(): void {
    this.enumValues.getHolidayList().subscribe((data) => {
      this.holidayList = data.Dates;
    });
  }
}
