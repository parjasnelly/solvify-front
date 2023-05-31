import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiChoiceTypeComponent } from './multi-choice-type.component';

describe('MultiChoiceTypeComponent', () => {
  let component: MultiChoiceTypeComponent;
  let fixture: ComponentFixture<MultiChoiceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiChoiceTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiChoiceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
