import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';

const ONLY_COMPLETED_CERTIFICATE_GOALS_QUERY = gql`
  query GoalInfoById($userId: String) {
    goalInfoById(UserId: $userId) {
      _id
      GoalName
      GoalDescription
      Status
      StartDate
      TargetEndDate
      Achieveddate
      CertificateId {
        _id
        CertificateName
        Description
        CompletedDate
        CreatedBy
        CreatedDate
        UpdatedBy
        UpdatedDate
        IsActive
        IsDeleted
      }
      UserId {
        _id
        FirstName
        MiddleName
        LastName
        EmployeeCode
        UserId {
          UserId
          FirstName
          LastName
          UserName
          Email
          Password
          Role
          CreatedBy
          UpdatedBy
          IsActive
          IsDeleted
        }

        Gender
        Contact {
          CountryCode
          Primary
          Emergency
        }
        Email {
          CompanyMail
          PersonalMail
        }
        Location {
          Flat
          Area
          Landmark
          Pincode
          City
          State
        }
        dob
        doj
        doc
        Department {
          DepartmentName
          Description
          CreatedBy
          UpdatedBy
          IsActive
          IsDeleted
          _id
          CreatedDate
          UpdatedDate
        }
        SkillSet {
          EmployeeSkillsetId
          PrimarySkillset
          SecondarySkillset
          SkillLevel
          Experience
          Certification {
            CertificationName
            CertificationDate
          }
        }
        Assets {
          _id
          AssetModel
          AssetType
          Memory
          Processor
          OperatingSystem
          WarrantyStart
          WarrantyExpire
          AssetTag
          SerialNumber
          AssignDate
          DischargeDate
          AssetPurchaseDate
          AssetCondition
          Cost
          Vendor
          Description
          CreatedBy
          CreatedDate
          UpdatedBy
          UpdatedDate
          IsActive
          IsDeleted
        }
        ManagerId
        Designation
        CreatedBy
        UpdatedBy
        IsActive
        IsDeleted
      }
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
export class GoalsService {
  constructor(private apollo: Apollo) {}

  getOnlyCompletedCertificateGoals(userId: string): Observable<any> {
    return this.apollo
      .watchQuery<any>({
        query: ONLY_COMPLETED_CERTIFICATE_GOALS_QUERY,
        variables: {
          userId: userId,
        },
      })
      .valueChanges.pipe(map((info) => info.data.goalInfoById));
  }
}
