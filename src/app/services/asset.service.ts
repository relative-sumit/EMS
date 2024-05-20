import { Injectable, input } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable, map, throwError } from 'rxjs';
import { EncryptingDecryptingService } from './encrypting-decrypting.service';
import { catchError } from 'rxjs/operators';

export interface Asset {
  _id: string;
  AssetName: string;
  AssetModel: string;
  AssetType: string;
  Memory: string;
  Processor: string;
  OperatingSystem: string;
  Warranty: string;
  AssetTag: string;
  SerialNumber: string;
  AssignTo: string;
  AssignDate: string;
  DischargeDate: string;
  Description: string;
  Addon: string;
  IsWorkable: number;
  CreatedBy: string;
  CreatedDate: string;
  UpdatedBy: string;
  UpdatedDate: string;
  IsActive: number;
  IsDeleted: number;
}
const ASSET_CREATE_MUTATION = gql`
  mutation CreateAsset(
    $assetName: String
    $assetModel: String
    $assetType: String
    $memory: String
    $processor: String
    $operatingSystem: String
    $warranty: String
    $assetTag: String
    $serialNumber: String
    $assignTo: String
    $assignDate: String
    $dischargeDate: String
    $description: String
    $addon: String
    $isWorkable: Int
    $createdBy: String
  ) {
    createAsset(
      AssetName: $assetName
      AssetModel: $assetModel
      AssetType: $assetType
      Memory: $memory
      Processor: $processor
      OperatingSystem: $operatingSystem
      Warranty: $warranty
      AssetTag: $assetTag
      SerialNumber: $serialNumber
      AssignTo: $assignTo
      AssignDate: $assignDate
      DischargeDate: $dischargeDate
      Description: $description
      Addon: $addon
      IsWorkable: $isWorkable
      CreatedBy: $createdBy
    ) {
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
      AssignTo
      AssignDate
      DischargeDate
      Description
      Addon
      IsWorkable
      CreatedBy
      CreatedDate
      UpdatedBy
      UpdatedDate
      IsActive
      IsDeleted
      Message
    }
  }
`;

const ALL_ASSET_QUERY = gql`
  query GetAsset {
    getAsset {
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
      AssignTo
      AssignDate
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
      AssignTo
      AssignDate
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
  private searchText = new BehaviorSubject<string>('');
  getsearchText = this.searchText.asObservable();

  private assetSubject = new BehaviorSubject<any>(null);
  asset = this.assetSubject.asObservable();

  constructor(
    private apollo: Apollo,
    private encrDcpr: EncryptingDecryptingService
  ) {}

  setSearchText(searchText: string) {
    this.searchText.next(searchText);
  }

  setAsset(asset: any) {
    this.assetSubject.next(asset);
  }

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
          assetName: form.assetName,
          assetModel: form.assetModel,
          assetType: form.assetType,
          memory: form.memory,
          processor: form.processor,
          operatingSystem: form.operatingSystem,
          warranty: form.warranty,
          assetTag: form.assetTag,
          serialNumber: form.serialNumber,
          assignTo: form.assignTo,
          assignDate: form.assignDate,
          description: form.description,
          addon: form.addon,
          isWorkable: form.isWorkable,
          createdBy: createdBy,
        },
      })
      .pipe(
        map((result) => result.data.createAsset),
        catchError((error) => {
          console.log('Error occurred:', error);
          return throwError(() => new Error(error));
        })
      );
  }

  getAllAsset(): Observable<any> {
    return this.apollo
      .watchQuery<any>({
        query: ALL_ASSET_QUERY,
      })
      .valueChanges.pipe(map((result) => result.data.getAsset));
  }

  updateAsset(_id: string, form: any): Observable<any> {
    if (form.IsWorkable) {
      form.IsWorkable = 1;
    } else {
      form.IsWorkable = 0;
    }

    const encrUserName = '' + sessionStorage.getItem('username');
    const updatedBy = this.encrDcpr.decrypt(encrUserName);
    form.UpdatedBy = updatedBy;
    form._id = _id;
    return this.apollo
      .mutate<any>({
        mutation: UPDATE_ASSET_QUERY,
        variables: { input: form },
      })
      .pipe(map((result) => result.data.updateAsset));
  }

  deleteAsset(asset: any): Observable<any> {
    let newObj;
    if (Object.isFrozen(asset)) {
      newObj = { ...asset, IsDeleted: 1 };
    }

    const encrUserName = '' + sessionStorage.getItem('username');
    const updatedBy = this.encrDcpr.decrypt(encrUserName);

    console.log(newObj);

    return this.apollo
      .mutate<any>({
        mutation: UPDATE_ASSET_QUERY,
        variables: {
          input: {
            _id: newObj._id,
            AssetName: newObj.assetName,
            AssetModel: newObj.assetModel,
            AssetType: newObj.assetType,
            Memory: newObj.memory,
            Processor: newObj.processor,
            OperatingSystem: newObj.operatingSystem,
            Warranty: newObj.warranty,
            AssetTag: newObj.assetTag,
            SerialNumber: newObj.serialNumber,
            AssignTo: newObj.AssignTo,
            AssignDate: newObj.AssignDate,
            Description: newObj.description,
            Addon: newObj.addon,
            IsWorkable: newObj.isWorkable,
            UpdatedBy: updatedBy,
            IsDeleted: newObj.IsDeleted,
          },
        },
      })
      .pipe(map((result) => result.data.updateAsset));
  }
}
