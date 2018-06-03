import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantTypeComponent } from './restaurant-type.component';

describe('RestaurantTypeComponent', () => {
  let component: RestaurantTypeComponent;
  let fixture: ComponentFixture<RestaurantTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
