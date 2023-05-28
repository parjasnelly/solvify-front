import { Component, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-multi-true-false-type',
  templateUrl: './multi-true-false-type.component.html',
  styleUrls: ['./multi-true-false-type.component.sass'],
})
export class MultiTrueFalseTypeComponent {
  constructor(private builder: FormBuilder) {}

  @Input() parentForm!: FormGroup;
  @Input() optionFields!: FormArray<FormGroup<any>>;

  addOption() {
    const newOption = this.builder.group({
      statement: ['', Validators.required],
      answer: new FormControl<boolean>(false),
    });

    this.optionFields.push(newOption);
  }

  removeOption() {
    this.optionFields.removeAt(this.optionFields.length - 1);
  }
}
