import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { EncryptingDecryptingService } from './encrypting-decrypting.service';

const PERMISSION_CREATE_MUTATION = gql`
  mutation ($Name: String, $CreatedBy: String) {
    createPermission(Name: $Name, CreatedBy: $CreatedBy) {
      Name
    }
  }
`;

const ROLE_CREATE_MUTATION = gql`
  mutation CreateRole(
    $Name: String
    $Description: String
    $Permission: [String]
    $CreatedBy: String
  ) {
    createRole(
      Name: $Name
      Description: $Description
      Permission: $Permission
      CreatedBy: $CreatedBy
    ) {
      CreatedBy
      Description
      Name
      Permission
    }
  }
`;

const ALL_PERMISSION_QUERY = gql`
  query GetPermission {
    getPermission {
      Name
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(
    private apollo: Apollo,
    private encrDcpr: EncryptingDecryptingService
  ) {}

  createPermission(name: string): Observable<any> {
    const encrUserName = '' + sessionStorage.getItem('username');
    const createdBy = this.encrDcpr.decrypt(encrUserName);
    return this.apollo
      .mutate<any>({
        mutation: PERMISSION_CREATE_MUTATION,
        variables: {
          Name: name,
          CreatedBy: createdBy,
        },
      })
      .pipe(map((result) => result.data.createPermission));
  }

  createRole(
    name: string,
    description: string,
    permission: any
  ): Observable<any> {
    const encrUserName = '' + sessionStorage.getItem('username');
    const createdBy = this.encrDcpr.decrypt(encrUserName);

    const permissionArray: any[] = [];
    permission.forEach((data: { Name: any }) => {
      permissionArray.push(data.Name);
    });

    return this.apollo
      .mutate<any>({
        mutation: ROLE_CREATE_MUTATION,
        variables: {
          Name: name,
          Description: description,
          Permission: permissionArray,
          CreatedBy: createdBy,
        },
      })
      .pipe(map((result) => result.data.createRole));
  }

  getAllPermission(): Observable<any> {
    return this.apollo
      .watchQuery<any>({
        query: ALL_PERMISSION_QUERY,
      })
      .valueChanges.pipe(map((result) => result.data.getPermission));
  }
}
