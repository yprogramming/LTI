import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttractionAllComponent } from './attraction-all.component';

describe('AttractionAllComponent', () => {
  let component: AttractionAllComponent;
  let fixture: ComponentFixture<AttractionAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttractionAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttractionAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
