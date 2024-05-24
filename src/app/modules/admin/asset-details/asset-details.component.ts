import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Asset, AssetService } from '../../../services/asset.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchPipe } from '../../../pipes/search.pipe';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface AssetType {
  SrNo: number;
  AssetName: string;
  AssetModel: string;
  AssetType: string;
  Processor: string;
  SerialNumber: string;
  AssignTo: string;
  IsWorkable: string;
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
      let count = 1;
      data.forEach((item: any) => {
        const newObj = {
          SrNo: count,
          AssetName: item.AssetName,
          AssetModel: item.AssetModel,
          AssetType: item.AssetType,
          Processor: item.Processor,
          SerialNumber: item.SerialNumber,
          AssignTo: item.AssignTo,
          IsWorkable: item.IsWorkable,
        };
        this.assetList.push(newObj);
        count++;
      });
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

  updateAsset(asset: Asset) {
    this.asset.setAsset(asset);
    this.router.navigate(['admin/update-asset']);
  }

  deleteAsset(asset: Asset) {
    console.log(asset);

    if (confirm('Are you sure, delete asset?')) {
      this.asset.deleteAsset(asset).subscribe(
        (data) => {
          console.log(data);
          alert('Asset deleted successfully!');
          this.asset.getAllAsset().subscribe((data) => {
            this.assetList = data;
          });
        },
        (error) => {
          console.error(error);
        }
      );
    }
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
}
