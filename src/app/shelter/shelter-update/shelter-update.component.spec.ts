import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelterUpdateComponent } from './shelter-update.component';

describe('ShelterUpdateComponent', () => {
  let component: ShelterUpdateComponent;
  let fixture: ComponentFixture<ShelterUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShelterUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelterUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
