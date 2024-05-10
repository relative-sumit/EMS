import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../../services/asset.service';

@Component({
  selector: 'app-asset-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asset-details.component.html',
  styleUrl: './asset-details.component.css',
})
export class AssetDetailsComponent implements OnInit {
  assetList: any[] = [];
  constructor(private asset: AssetService) {}
  ngOnInit(): void {
    this.asset.getAllAsset().subscribe((data) => {
      this.assetList = data;
    });
  }
}
