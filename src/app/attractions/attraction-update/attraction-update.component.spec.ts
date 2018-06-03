import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttractionUpdateComponent } from './attraction-update.component';

describe('AttractionUpdateComponent', () => {
  let component: AttractionUpdateComponent;
  let fixture: ComponentFixture<AttractionUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttractionUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttractionUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
