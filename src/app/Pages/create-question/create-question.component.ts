import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ProblemService } from 'src/app/Services/question.service';
import { ProblemFormData, ProblemType } from 'src/app/Types/Problem';
import { AuthService } from 'src/app/services/auth.service';

interface SelectOptions {
  name: string;
  value: number | string;
}

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.sass'],
})
export class CreateQuestionComponent implements OnInit {
  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private problemService: ProblemService,
    private router: Router
  ) {}

  loading: boolean = false;

  subjectOptions: SelectOptions[] = [
    { name: 'Matemática', value: 1 },
    { name: 'Português', value: 2 },
    { name: 'História', value: 3 },
    { name: 'Geografia', value: 4 },
    { name: 'Biologia', value: 5 },
    { name: 'Física', value: 6 },
    { name: 'Química', value: 7 },
    { name: 'Filosofia', value: 8 },
    { name: 'Sociologia', value: 9 },
    { name: 'Inglês', value: 10 },
    { name: 'Espanhol', value: 11 },
  ];

  levelOfEducationOptions: SelectOptions[] = [
    { name: 'Ensino Fundamental', value: 'primary school' },
    { name: 'Ensino Médio', value: 'high school' },
    { name: 'Ensino Superior', value: 'college' },
  ];

  topicOptions: Record<number, SelectOptions[]> = {
    1: [
      { name: 'Álgebra', value: 1 },
      { name: 'Geometria', value: 2 },
      { name: 'Trigonometria', value: 3 },
    ],
    2: [
      { name: 'Gramática', value: 1 },
      { name: 'Literatura', value: 2 },
    ],
    3: [
      { name: 'História do Brasil', value: 1 },
      { name: 'História da América', value: 2 },
      { name: 'História da Europa', value: 3 },
    ],
    4: [
      { name: 'Geografia do Brasil', value: 1 },
      { name: 'Geografia da América', value: 2 },
      { name: 'Geografia da Europa', value: 3 },
    ],
    5: [
      { name: 'Biologia Celular', value: 1 },
      { name: 'Biologia Molecular', value: 2 },
      { name: 'Biologia Animal', value: 3 },
      { name: 'Biologia Vegetal', value: 4 },
    ],
    6: [
      { name: 'Física Clássica', value: 1 },
      { name: 'Física Moderna', value: 2 },
    ],
    7: [
      { name: 'Química Orgânica', value: 1 },
      { name: 'Química Inorgânica', value: 2 },
    ],
    8: [
      { name: 'Filosofia Antiga', value: 1 },
      { name: 'Filosofia Medieval', value: 2 },
      { name: 'Filosofia Moderna', value: 3 },
      { name: 'Filosofia Contemporânea', value: 4 },
    ],
    9: [
      { name: 'Sociologia Antiga', value: 1 },
      { name: 'Sociologia Medieval', value: 2 },
      { name: 'Sociologia Moderna', value: 3 },
      { name: 'Sociologia Contemporânea', value: 4 },
    ],
    10: [
      { name: 'Inglês Básico', value: 1 },
      { name: 'Inglês Intermediário', value: 2 },
      { name: 'Inglês Avançado', value: 3 },
    ],
    11: [
      { name: 'Espanhol Básico', value: 1 },
      { name: 'Espanhol Intermediário', value: 2 },
      { name: 'Espanhol Avançado', value: 3 },
    ],
  };

  languageOptions: SelectOptions[] = [
    { name: 'Português', value: 'pt' },
    { name: 'Inglês', value: 'en' },
    { name: 'Espanhol', value: 'es' },
    { name: 'Francês', value: 'fr' },
    { name: 'Alemão', value: 'de' },
  ];

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
    statement: ['', Validators.required],
    optionFields: this.builder.array<FormGroup<any>>([]),
    feedback: ['', Validators.required],
    levelOfEducation: ['', Validators.required],
    topic: ['', Validators.required],
    subtopic: new FormControl(''),
    subject: ['', Validators.required],
    language: ['', Validators.required],
    // files: new FormControl<File[]>([]),
  });

  ngOnInit() {
    this.questionForm.get('type')!.valueChanges.subscribe(() => {
      this.updateFormOnTypeChange();
    });
  }

  getSelectedQuestionType() {
    return parseInt(this.questionForm.get('type')!.value!.toString());
  }

  getSelectedSubject() {
    const selectedSubject = parseInt(
      this.questionForm.get('subject')!.value!.toString()
    );

    if (isNaN(selectedSubject)) {
      return -1;
    }

    return selectedSubject;
  }

  // getCurrentFileCount() {
  //   return this.questionForm.get('files')!.value!.length;
  // }

  onFileSelect(event: Event) {
    const files: FileList = (event.target as HTMLInputElement).files!;
    const selectedFiles = Array.from(files);
    // this.questionForm.patchValue({ files: selectedFiles });
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
      this.questionForm.controls.statement = new FormControl('');

      const trueFalseFields = this.builder.array([
        this.builder.group({
          statement: ['', Validators.required],
          answer: new FormControl<boolean>(false),
        }),
      ]);
      this.questionForm.controls.optionFields = trueFalseFields;
    } else if (type === ProblemType.MULTITRUEFALSE) {
      this.questionForm.controls.statement = new FormControl('', [
        Validators.required,
      ]);

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
      this.questionForm.controls.statement = new FormControl('', [
        Validators.required,
      ]);

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
      this.questionForm.controls.statement = new FormControl('', [
        Validators.required,
      ]);

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
    if (this.questionForm.valid) {
      this.loading = true;

      const formData: ProblemFormData = {
        userId: this.authService.user.id,
        statement: this.questionForm.value.statement!,
        subjectId: this.questionForm.value.subject!,
        topicId: this.questionForm.value.topic!,
        subtopicId: '11111',
        feedback: this.questionForm.value.feedback!,
        language: this.questionForm.value.language!,
        levelOfEducation: this.questionForm.value.levelOfEducation!,
        optionFields: this.questionForm.value.optionFields!,
        title: this.questionForm.value.title!,
      };

      switch (parseInt(this.questionForm.value.type!.toString())) {
        case ProblemType.TRUEFALSE:
          this.problemService.addTrueFalseProblem(formData).subscribe(() => {
            this.loading = false;
            this.router.navigate(['/']);
          });
          break;
        case ProblemType.MULTITRUEFALSE:
          this.problemService
            .addMultiTrueFalseProblem(formData)
            .subscribe(() => {
              this.loading = false;
              this.router.navigate(['/']);
            });
          break;
        case ProblemType.MULTICHOICE:
          this.problemService.addMultiChoiceProblem(formData).subscribe(() => {
            this.loading = false;
            this.router.navigate(['/']);
          });
          break;
        case ProblemType.MULTISELECT:
          this.problemService.addMultiSelectProblem(formData).subscribe(() => {
            this.loading = false;
            this.router.navigate(['/']);
          });
          break;
        default:
          this.loading = false;
          break;
      }
    } else {
      console.log('invalid');
    }
  }
}
