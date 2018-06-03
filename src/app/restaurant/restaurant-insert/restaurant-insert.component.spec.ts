import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantInsertComponent } from './restaurant-insert.component';

describe('RestaurantInsertComponent', () => {
  let component: RestaurantInsertComponent;
  let fixture: ComponentFixture<RestaurantInsertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantInsertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
