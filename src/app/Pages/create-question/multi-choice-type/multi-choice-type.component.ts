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
  @Input() optionFields!: FormArray<FormGroup<any>>;

  @Output() optionFieldsEdited = new EventEmitter<FormArray>();

  onOptionClick(index: number) {
    this.optionFields.controls.forEach((option, i) => {
      if (index === i) {
        option.patchValue({ isCorrect: true });
      } else {
        option.patchValue({ isCorrect: false });
      }
    });
    this.optionFieldsEdited.emit(this.optionFields);
  }

  addOption() {
    const newOption = this.builder.group({
      label: ['', Validators.required],
      isCorrect: new FormControl<boolean>(false),
    });

    this.optionFields.push(newOption);
    this.optionFieldsEdited.emit(this.optionFields);
  }

  removeOption() {
    this.optionFields.removeAt(this.optionFields.length - 1);
    this.optionFieldsEdited.emit(this.optionFields);
  }
}
