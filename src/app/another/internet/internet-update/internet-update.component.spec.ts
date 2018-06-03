import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternetUpdateComponent } from './internet-update.component';

describe('InternetUpdateComponent', () => {
  let component: InternetUpdateComponent;
  let fixture: ComponentFixture<InternetUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternetUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternetUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
