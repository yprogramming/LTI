import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportationInsertComponent } from './transportation-insert.component';

describe('TransportationInsertComponent', () => {
  let component: TransportationInsertComponent;
  let fixture: ComponentFixture<TransportationInsertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportationInsertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportationInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
