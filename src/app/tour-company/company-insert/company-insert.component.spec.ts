import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyInsertComponent } from './company-insert.component';

describe('CompanyInsertComponent', () => {
  let component: CompanyInsertComponent;
  let fixture: ComponentFixture<CompanyInsertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyInsertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
