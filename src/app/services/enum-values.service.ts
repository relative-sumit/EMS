import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';

const ALL_ENUM_VALUES_QUERY = gql`
query GetAllEnumValues {
  getAllEnumValues {
    AssetType
    Warranty
    LaptopOperatingSystem
    MobileOperatingSystem
    Skillset
    SkillLevel
    Department
    Designation
    Role
    AssetStatus
  }
}
`;
const ALL_HOLIDAY_QUERY = gql`
query GetAllHoliday {
  getAllHoliday {
    Dates
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
export class EnumValuesService {
  constructor(private apollo: Apollo) {}

  getAllEnumValues(): Observable<any> {
    return this.apollo
      .watchQuery<any>({
        query: ALL_ENUM_VALUES_QUERY,
      })
      .valueChanges.pipe(map((result) => result.data.getAllEnumValues[0]));
  }
  getHolidayList(): Observable<any> {
    return this.apollo
      .watchQuery<any>({
        query: ALL_HOLIDAY_QUERY,
      })
      .valueChanges.pipe(map((result) => result.data.getAllHoliday[0]));
  }
}
