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
import { SubjectService } from 'src/app/Services/subject.service';
import { ProblemFormData, ProblemType } from 'src/app/Types/Problem';
import { AuthService } from 'src/app/services/auth.service';

interface SelectOptions {
  name: string;
  value: number | string;
}

const VALID_TEXT_PATTERN = /^\S[A-Za-z0-9.,!?'"()\[\]{}<>:;\-\s]*\S+$/;

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
    private subjectService: SubjectService,
    private router: Router
  ) {}

  loading: boolean = false;
  subjectOptions: SelectOptions[] = [];
  topicOptions: SelectOptions[] = [];

  levelOfEducationOptions: SelectOptions[] = [
    { name: 'Ensino Fundamental', value: 'primary school' },
    { name: 'Ensino Médio', value: 'high school' },
    { name: 'Ensino Superior', value: 'college' },
  ];

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
    title: ['', [Validators.required, Validators.pattern(VALID_TEXT_PATTERN)]],
    type: new FormControl<ProblemType | undefined>(undefined),
    statement: [
      '',
      [Validators.required, Validators.pattern(VALID_TEXT_PATTERN)],
    ],
    optionFields: this.builder.array<FormGroup<any>>([]),
    feedback: [
      '',
      [Validators.required, Validators.pattern(VALID_TEXT_PATTERN)],
    ],
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

    this.subjectService.getSubjects().subscribe(
      (subjects) =>
        (this.subjectOptions = subjects.map((subject) => ({
          name: subject.name,
          value: subject.id,
        })))
    );

    this.questionForm.get('subject')!.valueChanges.subscribe(() => {
      this.subjectService.getSubjectTopics(this.getSelectedSubject()).subscribe(
        (topics) =>
          (this.topicOptions = topics.map((topic) => ({
            name: topic.name,
            value: topic.id,
          })))
      );
    });
  }

  getSelectedQuestionType() {
    return parseInt(this.questionForm.get('type')!.value!.toString());
  }

  getSelectedSubject() {
    const selectedSubject = this.questionForm.get('subject')!.value!.toString();

    return selectedSubject;
  }

  getOptionFields() {
    return this.questionForm.get('optionFields') as FormArray;
  }

  // getCurrentFileCount() {
  //   return this.questionForm.get('files')!.value!.length;
  // }

  onFileSelect(event: Event) {
    const files: FileList = (event.target as HTMLInputElement).files!;
    const selectedFiles = Array.from(files);
    // this.questionForm.patchValue({ files: selectedFiles });
  }

  onOptionFieldsEdited(optionFields: any[]) {
    this.questionForm.setValue(
      {
        title: this.questionForm.get('title')!.value,
        feedback: this.questionForm.get('feedback')!.value,
        levelOfEducation: this.questionForm.get('levelOfEducation')!.value,
        topic: this.questionForm.get('topic')!.value,
        subtopic: this.questionForm.get('subtopic')!.value,
        subject: this.questionForm.get('subject')!.value,
        language: this.questionForm.get('language')!.value,
        type: this.questionForm.get('type')!.value,
        statement: this.questionForm.get('statement')!.value,
        optionFields: optionFields,
      },
      { emitEvent: false }
    );
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
          statement: [
            '',
            [Validators.required, Validators.pattern(VALID_TEXT_PATTERN)],
          ],
          answer: new FormControl<boolean>(false),
        }),
      ]);
      this.questionForm.controls.optionFields = trueFalseFields;
    } else if (type === ProblemType.MULTITRUEFALSE) {
      this.questionForm.controls.statement = new FormControl('', [
        Validators.required,
        Validators.pattern(VALID_TEXT_PATTERN),
      ]);

      const trueFalseFields = this.builder.array([
        this.builder.group({
          statement: [
            '',
            [Validators.required, Validators.pattern(VALID_TEXT_PATTERN)],
          ],
          answer: new FormControl<boolean>(true),
        }),
        this.builder.group({
          statement: [
            '',
            [Validators.required, Validators.pattern(VALID_TEXT_PATTERN)],
          ],
          answer: new FormControl<boolean>(false),
        }),
        this.builder.group({
          statement: [
            '',
            [Validators.required, Validators.pattern(VALID_TEXT_PATTERN)],
          ],
          answer: new FormControl<boolean>(false),
        }),
      ]);

      this.questionForm.controls.optionFields = trueFalseFields;
    } else if (type === ProblemType.MULTICHOICE) {
      this.questionForm.controls.statement = new FormControl('', [
        Validators.required,
        Validators.pattern(VALID_TEXT_PATTERN),
      ]);

      const multiChoiceFields = this.builder.array([
        this.builder.group({
          label: [
            '',
            [Validators.required, Validators.pattern(VALID_TEXT_PATTERN)],
          ],
          isCorrect: new FormControl<boolean>(true),
        }),
        this.builder.group({
          label: [
            '',
            [Validators.required, Validators.pattern(VALID_TEXT_PATTERN)],
          ],
          isCorrect: new FormControl<boolean>(false),
        }),
        this.builder.group({
          label: [
            '',
            [Validators.required, Validators.pattern(VALID_TEXT_PATTERN)],
          ],
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
          label: [
            '',
            [Validators.required, Validators.pattern(VALID_TEXT_PATTERN)],
          ],
          isCorrect: new FormControl<boolean>(true),
        }),
        this.builder.group({
          label: [
            '',
            [Validators.required, Validators.pattern(VALID_TEXT_PATTERN)],
          ],
          isCorrect: new FormControl<boolean>(false),
        }),
        this.builder.group({
          label: [
            '',
            [Validators.required, Validators.pattern(VALID_TEXT_PATTERN)],
          ],
          isCorrect: new FormControl<boolean>(false),
        }),
        this.builder.group({
          label: [
            '',
            [Validators.required, Validators.pattern(VALID_TEXT_PATTERN)],
          ],
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
      for (let el in this.questionForm.controls) {
        if (this.questionForm.get(el)!.invalid) {
          console.log(el);
        }
      }
      console.log('invalid');
    }
  }
}
