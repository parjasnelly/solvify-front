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
    title: ['', Validators.required],
    type: new FormControl<ProblemType | undefined>(undefined),
    description: ['', Validators.required],
    question: ['', Validators.required],
    optionFields: this.builder.array<FormGroup<any>>([]),
    explanation: new FormControl(''),
    files: new FormControl<File[]>([]),
  });

  ngOnInit() {
    this.questionForm.get('type')!.valueChanges.subscribe(() => {
      this.updateFormOnTypeChange();
    });
  }

  getSelectedQuestionType() {
    return parseInt(this.questionForm.get('type')!.value!.toString());
  }

  getCurrentFileCount() {
    return this.questionForm.get('files')!.value!.length;
  }

  onFileSelect(event: Event) {
    const files: FileList = (event.target as HTMLInputElement).files!;
    const selectedFiles = Array.from(files);
    this.questionForm.patchValue({ files: selectedFiles });
  }

  onOptionFieldsEdited(optionFields: FormArray) {
    this.questionForm.controls.optionFields = optionFields;
    this.questionForm.value.optionFields = optionFields.value;
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
    } else if (type === ProblemType.MULTICHOICE) {
      const multiChoiceFields = this.builder.array([
        this.builder.group({
          label: ['', Validators.required],
          isCorrect: new FormControl<boolean>(true),
        }),
        this.builder.group({
          label: ['', Validators.required],
          isCorrect: new FormControl<boolean>(false),
        }),
        this.builder.group({
          label: ['', Validators.required],
          isCorrect: new FormControl<boolean>(false),
        }),
      ]);

      this.questionForm.controls.optionFields = multiChoiceFields;
    } else if (type === ProblemType.MULTISELECT) {
      const multiSelectFields = this.builder.array([
        this.builder.group({
          label: ['', Validators.required],
          isCorrect: new FormControl<boolean>(true),
        }),
        this.builder.group({
          label: ['', Validators.required],
          isCorrect: new FormControl<boolean>(false),
        }),
        this.builder.group({
          label: ['', Validators.required],
          isCorrect: new FormControl<boolean>(false),
        }),
        this.builder.group({
          label: ['', Validators.required],
          isCorrect: new FormControl<boolean>(true),
        }),
      ]);

      this.questionForm.controls.optionFields = multiSelectFields;
    }
  }

  onSubmit() {
    if (!this.questionForm.valid) {
      console.log(this.questionForm.value);
    }
  }
}
