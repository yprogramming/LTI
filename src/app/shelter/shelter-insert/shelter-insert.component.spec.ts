import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelterInsertComponent } from './shelter-insert.component';

describe('ShelterInsertComponent', () => {
  let component: ShelterInsertComponent;
  let fixture: ComponentFixture<ShelterInsertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShelterInsertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelterInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
