import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-true-false-type',
  templateUrl: './true-false-type.component.html',
  styleUrls: ['./true-false-type.component.sass'],
})
export class TrueFalseTypeComponent {
  @Input() parentForm!: FormGroup;
  @Input() optionFields!: FormArray<FormGroup<any>>;
}
