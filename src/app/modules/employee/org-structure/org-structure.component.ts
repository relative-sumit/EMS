import { Component } from '@angular/core';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-org-structure',
  standalone: true,
  imports: [OrganizationChartModule, CommonModule],
  templateUrl: './org-structure.component.html',
  styleUrl: './org-structure.component.css'
})
export class OrgStructureComponent {
  data: TreeNode[];
  constructor(){
    this.data = [
      {
        label: 'CEO',
        type: 'person',
        styleClass: 'p-person',
        expanded: true,
        data: { name: 'Walter White' },
        children: [
          {
            label: 'Team Lead',
            type: 'person',
            styleClass: 'p-person',
            expanded: true,
            data: { name: 'Saul Goodman' },
            children: [
              { label: 'Tax', styleClass: 'department-cfo' },
              { label: 'Legal', styleClass: 'department-cfo' }
            ]
          },
          {
            label: 'Team Lead',
            type: 'person',
            styleClass: 'p-person',
            expanded: true,
            data: { name: 'Mike Ehrmantraut' },
            children: [
              { label: 'Operations', styleClass: 'department-coo' }
            ]
          }
        ]
      }
    ];
  }
}
