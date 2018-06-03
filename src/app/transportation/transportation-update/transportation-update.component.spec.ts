import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportationUpdateComponent } from './transportation-update.component';

describe('TransportationUpdateComponent', () => {
  let component: TransportationUpdateComponent;
  let fixture: ComponentFixture<TransportationUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportationUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportationUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
