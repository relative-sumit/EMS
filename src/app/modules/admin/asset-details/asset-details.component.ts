import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../../services/asset.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchPipe } from '../../../pipes/search.pipe';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface AssetType {
  SrNo: number;
  AssetType: string;
  AssetModel: string;
  AssetTag: string;
  SerialNumber: string;
  AssignTo: string;
  Warranty: string;
  AssetCondition: string;
}

@Component({
  selector: 'app-asset-details',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, SearchPipe, FormsModule],
  templateUrl: './asset-details.component.html',
  styleUrl: './asset-details.component.css',
})
export class AssetDetailsComponent implements OnInit {
  assetList: any[] = [];
  tableSize: number = 5;
  tableSizes: any = [5, 10, 20];
  page: number = 1;
  count: number = 0;
  total: number = 0;
  searchText: string = '';
  key: string = '';
  reverse: boolean = false;

  constructor(private asset: AssetService, private router: Router) {}
  ngOnInit(): void {
    this.get();
  }

  get() {
    this.asset.getAllAsset().subscribe((data) => {
      // console.log(data);
      
      let count = 1;
      data.forEach((item: any) => {
        const newObj = {
          SrNo: count,
          AssetType: item.AssetType,
          AssetModel: item.AssetModel,
          AssetTag: item.AssetTag,
          SerialNumber: item.SerialNumber,
          AssignTo: item.AssignTo,
          Warranty: this.formatDate(item.WarrantyStart) + " - " + this.formatDate(item.WarrantyExpire),
          AssetCondition: item.AssetCondition,
        };
        this.assetList.push(newObj);
        count++;
      });
      console.log(this.assetList);
      
    });
  }

  changeSearchText() {
    this.asset.setSearchText(this.searchText);
  }

  tableDataChange(event: any) {
    this.page = event;
  }
  tableSizeChange(event: any) {
    this.tableSize = event.target.value;
    this.page = 1;
    this.get();
  }

  addNew() {
    this.router.navigate(['admin/create-asset']);
  }

  updateAsset(asset: any) {
    this.asset.setAsset(asset);
    this.router.navigate(['admin/update-asset']);
  }

  deleteAsset(asset: any) {
    console.log(asset);

    // if (confirm('Are you sure, delete asset?')) {
    //   this.asset.deleteAsset(asset).subscribe(
    //     (data) => {
    //       console.log(data);
    //       alert('Asset deleted successfully!');
    //       this.asset.getAllAsset().subscribe((data) => {
    //         this.assetList = data;
    //       });
    //     },
    //     (error) => {
    //       console.error(error);
    //     }
    //   );
    // }
  }

  sort(key: keyof AssetType) {
    if (this.reverse === false) {
      this.assetList = this.assetList.slice().sort((a, b) => {
        if (a[key] < b[key]) {
          return -1;
        }
        if (a[key] > b[key]) {
          return 1;
        }
        return 0;
      });
      this.reverse = !this.reverse;
    } else {
      this.reverse = !this.reverse;
      let leftIndex = 0;
      let rightIndex = this.assetList.length - 1;

      while (leftIndex < rightIndex) {
        const temp = this.assetList[leftIndex];
        this.assetList[leftIndex] = this.assetList[rightIndex];
        this.assetList[rightIndex] = temp;
        leftIndex++;
        rightIndex--;
      }
    }
  }

  formatDate(input: string): string {
    // Create an array with month names
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Split the input string to extract year and month
    const [year, month] = input.split("-");

    // Convert the month part to an integer and adjust for 0-based index
    const monthIndex = parseInt(month, 10) - 1;

    // Return the formatted string
    return `${months[monthIndex]}, ${year}`;
}
}
