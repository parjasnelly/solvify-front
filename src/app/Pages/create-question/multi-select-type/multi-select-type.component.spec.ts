import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectTypeComponent } from './multi-select-type.component';

describe('MultiSelectTypeComponent', () => {
  let component: MultiSelectTypeComponent;
  let fixture: ComponentFixture<MultiSelectTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiSelectTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiSelectTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
