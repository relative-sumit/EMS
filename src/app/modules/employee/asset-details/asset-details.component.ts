import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Asset, AssetService } from '../../../services/asset.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchPipe } from '../../../pipes/search.pipe';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asset-details',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, SearchPipe, FormsModule],
  templateUrl: './asset-details.component.html',
  styleUrl: './asset-details.component.css',
})
export class AssetDetailsComponent implements OnInit {
  assetList: Asset[] = [];
  page: number = 1;
  total: number = 0;
  searchText: string = '';
  key: string = '';

  constructor(private asset: AssetService, private router: Router) {}
  ngOnInit(): void {
    this.asset.getAllAsset().subscribe((data) => {
      this.assetList = data;
    });
  }

  changeSearchText() {
    this.asset.setSearchText(this.searchText);
  }

  pageChangeEvent(event: number) {
    this.page = event;
  }

  addNew() {
    this.router.navigate(['dashboard/create-asset']);
  }
}
