import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmployeeInfoComponent } from './create-employee-info.component';

describe('CreateEmployeeInfoComponent', () => {
  let component: CreateEmployeeInfoComponent;
  let fixture: ComponentFixture<CreateEmployeeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEmployeeInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateEmployeeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
