import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiTrueFalseTypeComponent } from './multi-true-false-type.component';

describe('MultiTrueFalseTypeComponent', () => {
  let component: MultiTrueFalseTypeComponent;
  let fixture: ComponentFixture<MultiTrueFalseTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiTrueFalseTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiTrueFalseTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
