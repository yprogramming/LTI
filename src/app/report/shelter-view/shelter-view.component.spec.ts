import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelterViewComponent } from './shelter-view.component';

describe('ShelterViewComponent', () => {
  let component: ShelterViewComponent;
  let fixture: ComponentFixture<ShelterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShelterViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
