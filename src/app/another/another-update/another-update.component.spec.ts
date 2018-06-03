import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnotherUpdateComponent } from './another-update.component';

describe('AnotherUpdateComponent', () => {
  let component: AnotherUpdateComponent;
  let fixture: ComponentFixture<AnotherUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnotherUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnotherUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
