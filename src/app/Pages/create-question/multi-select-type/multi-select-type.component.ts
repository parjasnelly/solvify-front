import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

const VALID_TEXT_PATTERN = /^\S+[A-Za-zÀ-ÿ0-9.,!?'"()\[\]{}<>:;\-\s\+*=]*\S*$/;

@Component({
  selector: 'app-multi-select-type',
  templateUrl: './multi-select-type.component.html',
  styleUrls: ['./multi-select-type.component.sass'],
})
export class MultiSelectTypeComponent {
  constructor(private builder: FormBuilder) {}

  @Input() parentForm!: FormGroup;
  @Input() isEdit!: boolean;
  @Output() onFieldsUpdate = new EventEmitter<any[]>();

  get optionFields() {
    return this.parentForm.get('optionFields') as FormArray;
  }

  onOptionFieldsEdit = () => {
    this.onFieldsUpdate.emit(this.optionFields.value);
  };

  addOption() {
    const newOption = this.builder.group({
      label: [
        '',
        [Validators.required, Validators.pattern(VALID_TEXT_PATTERN)],
      ],
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
