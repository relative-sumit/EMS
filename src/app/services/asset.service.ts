import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { EncryptingDecryptingService } from './encrypting-decrypting.service';

const ASSET_CREATE_MUTATION = gql`
  mutation CreateAsset(
    $AssetName: String
    $AssetModel: String
    $AssetType: String
    $Memory: String
    $Processor: String
    $OperatingSystem: String
    $Warranty: String
    $AssetTag: String
    $SerialNumber: String
    $Description: String
    $Addon: String
    $IsWorkable: Int
    $CreatedBy: String
  ) {
    createAsset(
      AssetName: $AssetName
      AssetModel: $AssetModel
      AssetType: $AssetType
      Memory: $Memory
      Processor: $Processor
      OperatingSystem: $OperatingSystem
      Warranty: $Warranty
      AssetTag: $AssetTag
      SerialNumber: $SerialNumber
      Description: $Description
      Addon: $Addon
      IsWorkable: $IsWorkable
      CreatedBy: $CreatedBy
    ) {
      AssetName
      AssetModel
      AssetType
      Memory
      Processor
      OperatingSystem
      Warranty
      AssetTag
      SerialNumber
      Description
      Addon
      IsWorkable
    }
  }
`;

const ALL_ASSET_QUERY = gql`
  query GetAsset {
    getAsset {
      AssetName
      AssetModel
      AssetType
      Memory
      Processor
      OperatingSystem
      Warranty
      AssetTag
      SerialNumber
      Description
      Addon
      IsWorkable
    }
  }
`;
const UPDATE_ASSET_QUERY = gql`
mutation UpdateAsset($input: AssetInput) {
  updateAsset(input: $input) {
    _id
    AssetName
    AssetModel
    AssetType
    Memory
    Processor
    OperatingSystem
    Warranty
    AssetTag
    SerialNumber
    Description
    Addon
    IsWorkable
    CreatedBy
    CreatedDate
    UpdatedBy
    UpdatedDate
    IsActive
    IsDeleted
  }
}
`;
@Injectable({
  providedIn: 'root',
})
export class AssetService {
  constructor(
    private apollo: Apollo,
    private encrDcpr: EncryptingDecryptingService
  ) {}

  createAsset(form: any): Observable<any> {
    if (form.isWorkable) {
      form.isWorkable = 1;
    } else {
      form.isWorkable = 0;
    }
    const encrUserName = '' + sessionStorage.getItem('username');
    const createdBy = this.encrDcpr.decrypt(encrUserName);
    return this.apollo
      .mutate<any>({
        mutation: ASSET_CREATE_MUTATION,
        variables: {
          AssetName: form.assetName,
          AssetModel: form.assetModel,
          AssetType: form.assetType,
          Memory: form.memory,
          Processor: form.processor,
          OperatingSystem: form.operatingSystem,
          Warranty: form.warranty,
          AssetTag: form.assetTag,
          SerialNumber: form.serialNumber,
          Description: form.description,
          Addon: form.addon,
          IsWorkable: form.isWorkable,
          CreatedBy: createdBy,
        },
      })
      .pipe(map((result) => result.data.createAsset));
  }

  getAllAsset(): Observable<any> {
    return this.apollo
      .watchQuery<any>({
        query: ALL_ASSET_QUERY,
      })
      .valueChanges.pipe(map((result) => result.data.getAsset));
  }

  updateAsset(): Observable<any> {
    return this.apollo
      .watchQuery<any>({
        query: UPDATE_ASSET_QUERY,
      })
      .valueChanges.pipe(map((result) => result.data.updateAsset));
  }
}
