import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourCompanyComponent } from './tour-company.component';

describe('TourCompanyComponent', () => {
  let component: TourCompanyComponent;
  let fixture: ComponentFixture<TourCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
