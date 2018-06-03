import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnotherInsertComponent } from './another-insert.component';

describe('AnotherInsertComponent', () => {
  let component: AnotherInsertComponent;
  let fixture: ComponentFixture<AnotherInsertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnotherInsertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnotherInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
