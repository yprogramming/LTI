import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressInsertComponent } from './address-insert.component';

describe('AddressInsertComponent', () => {
  let component: AddressInsertComponent;
  let fixture: ComponentFixture<AddressInsertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressInsertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
