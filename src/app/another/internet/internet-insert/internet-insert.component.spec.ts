import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternetInsertComponent } from './internet-insert.component';

describe('InternetInsertComponent', () => {
  let component: InternetInsertComponent;
  let fixture: ComponentFixture<InternetInsertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternetInsertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternetInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
