import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoQuestionTypeComponent } from './no-question-type.component';

describe('NoQuestionTypeComponent', () => {
  let component: NoQuestionTypeComponent;
  let fixture: ComponentFixture<NoQuestionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoQuestionTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoQuestionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
