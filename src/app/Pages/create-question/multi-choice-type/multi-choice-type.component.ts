import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-multi-choice-type',
  templateUrl: './multi-choice-type.component.html',
  styleUrls: ['./multi-choice-type.component.sass'],
})
export class MultiChoiceTypeComponent {
  constructor(private builder: FormBuilder) {}

  @Input() parentForm!: FormGroup;
  @Output() onFieldsUpdate = new EventEmitter<any[]>();

  get optionFields() {
    return this.parentForm.get('optionFields') as FormArray;
  }

  onOptionFieldsEdit = () => {
    this.onFieldsUpdate.emit(this.optionFields.value);
  };

  onOptionClick(index: number) {
    this.optionFields.controls.forEach((option, i) => {
      if (index === i) {
        option.patchValue({ isCorrect: true });
      } else {
        option.patchValue({ isCorrect: false });
      }
    });
    this.onFieldsUpdate.emit(this.optionFields.value);
  }

  addOption() {
    const newOption = this.builder.group({
      label: ['', Validators.required],
      isCorrect: new FormControl<boolean>(false),
    });

    this.optionFields.push(newOption);
    this.onFieldsUpdate.emit(this.optionFields.value);
  }

  removeOption() {
    this.optionFields.removeAt(this.optionFields.length - 1);
    this.onFieldsUpdate.emit(this.optionFields.value);
  }
}
