import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttractionInsertComponent } from './attraction-insert.component';

describe('AttractionInsertComponent', () => {
  let component: AttractionInsertComponent;
  let fixture: ComponentFixture<AttractionInsertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttractionInsertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttractionInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
