import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from '@angular/forms';
import { ProblemType } from 'src/app/Types/Problem';

interface SelectOptions {
  name: string;
  value: number;
}

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.sass'],
})
export class CreateQuestionComponent implements OnInit {
  constructor(private builder: FormBuilder) {}

  questionTypeOptions: SelectOptions[] = [
    { name: 'Escolha Unica', value: ProblemType.MULTICHOICE },
    { name: 'Escolha Multipla', value: ProblemType.MULTISELECT },
    { name: 'Verdadeiro e Falso', value: ProblemType.TRUEFALSE },
    {
      name: 'Verdadeiro e Falso Multiplo',
      value: ProblemType.MULTITRUEFALSE,
    },
  ];

  questionForm = this.builder.group({
    title: new FormControl(''),
    type: new FormControl<ProblemType | undefined>(undefined),
    description: new FormControl(''),
    question: new FormControl(''),
    optionFields: this.builder.array<FormGroup<any>>([]),
    explanation: new FormControl(''),
  });

  ngOnInit() {
    this.questionForm.get('type')!.valueChanges.subscribe(() => {
      this.updateFormOnTypeChange();
    });
  }

  getSelectedQuestionType() {
    return parseInt(this.questionForm.get('type')!.value!.toString());
  }

  updateFormOnTypeChange() {
    const type = parseInt(this.questionForm.get('type')!.value!.toString());

    const additionalFieldsArray = this.questionForm.get(
      'optionFields'
    ) as FormArray;
    while (additionalFieldsArray.length) {
      additionalFieldsArray.removeAt(0);
    }

    // Create and add new FormArray controls based on the selected type
    if (type === ProblemType.TRUEFALSE) {
      const trueFalseFields = this.builder.array([
        this.builder.group({
          statement: ['', Validators.required],
          answer: new FormControl<boolean>(false),
        }),
      ]);
      this.questionForm.controls.optionFields = trueFalseFields;
    } else if (type === ProblemType.MULTITRUEFALSE) {
      const trueFalseFields = this.builder.array([
        this.builder.group({
          statement: ['', Validators.required],
          answer: new FormControl<boolean>(true),
        }),
        this.builder.group({
          statement: ['', Validators.required],
          answer: new FormControl<boolean>(false),
        }),
        this.builder.group({
          statement: ['', Validators.required],
          answer: new FormControl<boolean>(false),
        }),
      ]);
      this.questionForm.controls.optionFields = trueFalseFields;
    }
  }
}
