import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttractionViewComponent } from './attraction-view.component';

describe('AttractionViewComponent', () => {
  let component: AttractionViewComponent;
  let fixture: ComponentFixture<AttractionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttractionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttractionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
