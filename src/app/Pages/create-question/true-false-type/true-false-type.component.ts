import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormArray,
  FormGroup,
  FormGroupDirective,
  FormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-true-false-type',
  templateUrl: './true-false-type.component.html',
  styleUrls: ['./true-false-type.component.sass'],
})
export class TrueFalseTypeComponent {
  @Input() parentForm!: FormGroup;
  @Output() onFieldsUpdate = new EventEmitter<any[]>();

  onOptionFieldsEdit = () => {
    this.onFieldsUpdate.emit(this.optionFields.value);
  };

  get optionFields() {
    return this.parentForm.get('optionFields') as FormArray;
  }
}
