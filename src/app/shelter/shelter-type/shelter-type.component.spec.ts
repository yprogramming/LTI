import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelterTypeComponent } from './shelter-type.component';

describe('ShelterTypeComponent', () => {
  let component: ShelterTypeComponent;
  let fixture: ComponentFixture<ShelterTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShelterTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelterTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
