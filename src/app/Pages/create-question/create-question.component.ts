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
import { MessageService } from 'primeng/api';
import { delay } from 'src/app/Utils/delay';

interface SelectOptions {
  name: string;
  value: number | string;
}

const VALID_TEXT_PATTERN = /^\S+[A-Za-zÀ-ÿ0-9.,!?'"()\[\]{}<>:;\-\s\+*=]*\S*$/;

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
    private router: Router,
    private messageService: MessageService
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
    topic: new FormControl(''),
    subtopic: new FormControl(''),
    subject: ['', Validators.required],
    language: ['pt', Validators.required],
    // files: new FormControl<File[]>([]),
  });

  ngOnInit() {
    this.questionForm.get('type')!.valueChanges.subscribe(() => {
      this.updateFormOnTypeChange();
    });

    console.log(this.subjectService.getSubjects());

    this.subjectOptions = this.subjectService.getSubjects().map((subject) => ({
      name: subject.name,
      value: subject.id,
    }));

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
      this.questionForm.patchValue({
        statement:
          this.questionForm.get('statement') !== null
            ? this.questionForm.get('statement')!.value
            : '',
      });

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
      this.questionForm.patchValue({
        statement:
          this.questionForm.get('statement') !== null
            ? this.questionForm.get('statement')!.value
            : '',
      });

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
      this.questionForm.patchValue({
        statement:
          this.questionForm.get('statement') !== null
            ? this.questionForm.get('statement')!.value
            : '',
      });

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
      this.questionForm.patchValue({
        statement:
          this.questionForm.get('statement') !== null
            ? this.questionForm.get('statement')!.value
            : '',
      });

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

  onSubmitSuccess = async () => {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Questão Adicionada.',
    });
    await delay(1000);
    this.loading = false;
    this.router.navigate(['/']);
  };

  onSubmit() {
    if (this.questionForm.valid) {
      this.loading = true;

      const formData: ProblemFormData = {
        userId: this.authService.user.id,
        userName: this.authService.user.name,
        statement: this.questionForm.value.statement!,
        subjectId: this.questionForm.value.subject!,
        topicId: this.questionForm.value.topic!,
        subtopicId: '',
        feedback: this.questionForm.value.feedback!,
        language: this.questionForm.value.language!,
        levelOfEducation: this.questionForm.value.levelOfEducation!,
        optionFields: this.questionForm.value.optionFields!,
        title: this.questionForm.value.title!,
      };

      switch (parseInt(this.questionForm.value.type!.toString())) {
        case ProblemType.TRUEFALSE:
          this.problemService.addTrueFalseProblem(formData).subscribe(() => {
            this.onSubmitSuccess();
          });
          break;
        case ProblemType.MULTITRUEFALSE:
          this.problemService
            .addMultiTrueFalseProblem(formData)
            .subscribe(() => {
              this.onSubmitSuccess();
            });
          break;
        case ProblemType.MULTICHOICE:
          this.problemService.addMultiChoiceProblem(formData).subscribe(() => {
            this.onSubmitSuccess();
          });
          break;
        case ProblemType.MULTISELECT:
          this.problemService.addMultiSelectProblem(formData).subscribe(() => {
            this.onSubmitSuccess();
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
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos Invalidos',
        detail:
          'Verifique se todos os campos estão preenchidos apropriadamente.',
      });
    }
  }
}
