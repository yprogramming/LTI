import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportationViewComponent } from './transportation-view.component';

describe('TransportationViewComponent', () => {
  let component: TransportationViewComponent;
  let fixture: ComponentFixture<TransportationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
