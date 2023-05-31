import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-multi-select-type',
  templateUrl: './multi-select-type.component.html',
  styleUrls: ['./multi-select-type.component.sass'],
})
export class MultiSelectTypeComponent {
  constructor(private builder: FormBuilder) {}

  @Input() parentForm!: FormGroup;
  @Input() optionFields!: FormArray<FormGroup<any>>;

  @Output() optionFieldsEdited = new EventEmitter<FormArray>();

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
