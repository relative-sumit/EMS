import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';

const ALL_ENUM_VALUES_QUERY = gql`
  query GetAllEnumValues {
    getAllEnumValues {
      AssetType
      Warranty
      Skillset
      SkillLevel
      Department
      Designation
      Role
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class EnumValuesService {
  constructor(private apollo: Apollo) {}

  getAllEnumValues(): Observable<any> {
    return this.apollo
      .watchQuery<any>({
        query: ALL_ENUM_VALUES_QUERY,
      })
      .valueChanges.pipe(map((result) => result.data.getAllEnumValues[0]));
  }
}