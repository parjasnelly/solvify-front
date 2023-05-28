import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrueFalseTypeComponent } from './true-false-type.component';

describe('TrueFalseTypeComponent', () => {
  let component: TrueFalseTypeComponent;
  let fixture: ComponentFixture<TrueFalseTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrueFalseTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrueFalseTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
