import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportationTypeComponent } from './transportation-type.component';

describe('TransportationTypeComponent', () => {
  let component: TransportationTypeComponent;
  let fixture: ComponentFixture<TransportationTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportationTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
