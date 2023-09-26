import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProblemService } from 'src/app/Services/question.service';
import { SubjectService } from 'src/app/Services/subject.service';
import { ProblemFormData, ProblemType } from 'src/app/Types/Problem';
import { AuthService } from 'src/app/Services/auth.service';
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
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {}

  loading: boolean = false;
  subjectOptions: SelectOptions[] = [];
  topicOptions: SelectOptions[] = [];
  isEdit: boolean = false;

  levelOfEducationOptions: SelectOptions[] = [
    { name: 'Ensino Fundamental', value: 'primary' },
    { name: 'Ensino Médio', value: 'secondary' },
    { name: 'Ensino Superior', value: 'higher' },
  ];

  languageOptions: SelectOptions[] = [
    { name: 'Português', value: 'pt' },
    { name: 'Inglês', value: 'en' },
    { name: 'Espanhol', value: 'es' },
    { name: 'Francês', value: 'fr' },
    { name: 'Alemão', value: 'de' },
  ];

  questionTypeOptions: SelectOptions[] = [
    { name: 'Múltipla Escolha', value: ProblemType.MULTICHOICE },
    { name: 'Múltipla Seleção', value: ProblemType.MULTISELECT },
    { name: 'Verdadeiro ou Falso', value: ProblemType.TRUEFALSE },
    {
      name: 'Verdadeiro ou Falso Múltiplo',
      value: ProblemType.MULTITRUEFALSE,
    },
  ];

  questionForm = this.builder.group({
    type: new FormControl<ProblemType | undefined>(undefined),
    statement: [
      { value: '', disabled: false },
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

    if (this.router.url.includes('edit')) {
      this.isEdit = true;
      this.questionForm.get('statement')?.disable();

      this.problemService
        .getProblem(this.activatedRoute.snapshot.paramMap.get('id')!)
        .subscribe((data) => {
          const problemToEdit =
            this.problemService.convertProblemResponseToProblem(data);

          this.questionForm.patchValue({
            type: problemToEdit.problemType,
            statement: problemToEdit.statement,
            feedback: problemToEdit.feedback,
            levelOfEducation: problemToEdit.levelOfEducation,
            topic: problemToEdit.topicId,
            subtopic: problemToEdit.subtopicId,
            subject: problemToEdit.subjectId,
            language: problemToEdit.language,
          });

          if (problemToEdit.problemType === ProblemType.TRUEFALSE) {
            const statementSave = this.questionForm.get('statement')?.value;
            this.questionForm.patchValue({
              statement: '',
            });
            this.questionForm.get('statement')?.clearValidators();
            this.questionForm.get('statement')?.updateValueAndValidity();

            const trueFalseFields = this.builder.array([
              this.builder.group({
                statement: [
                  { value: statementSave, disabled: true },
                  [Validators.required, Validators.pattern(VALID_TEXT_PATTERN)],
                ],
                answer: new FormControl<boolean>({
                  value: problemToEdit.boolAnswer!,
                  disabled: true,
                }),
              }),
            ]);
            this.questionForm.controls.optionFields = trueFalseFields;
          } else if (problemToEdit.problemType === ProblemType.MULTITRUEFALSE) {
            this.fixStatementOnTypeChange();

            const builderArrayInfo = problemToEdit.items!.map((item, index) => {
              return this.builder.group({
                statement: [
                  { value: item, disabled: true },
                  [Validators.required, Validators.pattern(VALID_TEXT_PATTERN)],
                ],
                answer: new FormControl<boolean>({
                  value: problemToEdit.boolAnswers![index]!,
                  disabled: true,
                }),
              });
            });

            const trueFalseFields = this.builder.array(builderArrayInfo);

            this.questionForm.controls.optionFields = trueFalseFields;
          } else if (problemToEdit.problemType === ProblemType.MULTICHOICE) {
            this.fixStatementOnTypeChange();

            const builderArrayInfo = problemToEdit.items!.map((item, index) => {
              return this.builder.group({
                label: [
                  { value: item, disabled: true },
                  [
                    (Validators.required,
                    Validators.pattern(VALID_TEXT_PATTERN)),
                  ],
                ],
                isCorrect: new FormControl<boolean>({
                  value: problemToEdit.correctItem! === index,
                  disabled: true,
                }),
              });
            });

            const multiChoiceFields = this.builder.array(builderArrayInfo);

            this.questionForm.controls.optionFields = multiChoiceFields;
          } else if (problemToEdit.problemType === ProblemType.MULTISELECT) {
            this.fixStatementOnTypeChange();

            const builderArrayInfo = problemToEdit.items!.map((item, index) => {
              return this.builder.group({
                label: [
                  { value: item, disabled: true },
                  [Validators.required, Validators.pattern(VALID_TEXT_PATTERN)],
                ],
                isCorrect: new FormControl<boolean>({
                  value: problemToEdit.correctItems![index]!,
                  disabled: true,
                }),
              });
            });

            const multiSelectFields = this.builder.array(builderArrayInfo);

            this.questionForm.controls.optionFields = multiSelectFields;
          }
        });
    }
  }

  fixStatementOnTypeChange() {
    this.questionForm.patchValue({
      statement:
        this.questionForm.get('statement') !== null
          ? this.questionForm.get('statement')!.value
          : '',
    });
    this.questionForm
      .get('statement')
      ?.addValidators([
        Validators.required,
        Validators.pattern(VALID_TEXT_PATTERN),
      ]);

    this.questionForm.get('statement')?.updateValueAndValidity();
  }

  getSelectedQuestionType() {
    if (this.questionForm.get('type')!.value === null) return undefined;
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
      const statementSave = this.questionForm.get('statement')?.value;
      this.questionForm.patchValue({
        statement: '',
      });
      this.questionForm.get('statement')?.clearValidators();
      this.questionForm.get('statement')?.updateValueAndValidity();

      const trueFalseFields = this.builder.array([
        this.builder.group({
          statement: [
            statementSave,
            [Validators.required, Validators.pattern(VALID_TEXT_PATTERN)],
          ],
          answer: new FormControl<boolean>(false),
        }),
      ]);
      this.questionForm.controls.optionFields = trueFalseFields;
    } else if (type === ProblemType.MULTITRUEFALSE) {
      this.fixStatementOnTypeChange();

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
      this.fixStatementOnTypeChange();

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
      this.fixStatementOnTypeChange();

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
      detail: this.isEdit ? 'Questão Editada' : 'Questão Adicionada.',
    });
    await delay(1000);
    this.loading = false;

    this.router.navigate(['/']);
  };

  onCreateSubmit() {
    if (this.questionForm.valid) {
      this.loading = true;

      const formData: ProblemFormData = {
        userId: this.authService.userId,
        userName: this.authService.user.name,
        statement: this.questionForm.value.statement!,
        subjectId: this.questionForm.value.subject!,
        topicId: this.questionForm.value.topic!,
        subtopicId: '',
        feedback: this.questionForm.value.feedback!,
        language: this.questionForm.value.language!,
        levelOfEducation: this.questionForm.value.levelOfEducation!,
        optionFields: this.questionForm.value.optionFields!,
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
        summary: 'Campos Inválidos',
        detail:
          'Verifique se todos os campos estão preenchidos apropriadamente.',
      });
    }
  }

  onEditSubmit() {
    if (this.questionForm.valid) {
      this.loading = true;

      const editData: ProblemFormData = {
        userId: this.authService.userId,
        userName: this.authService.user.name,
        statement: this.questionForm.value.statement!,
        subjectId: this.questionForm.value.subject!,
        topicId: this.questionForm.value.topic!,
        subtopicId: '',
        feedback: this.questionForm.value.feedback!,
        language: this.questionForm.value.language!,
        levelOfEducation: this.questionForm.value.levelOfEducation!,
        optionFields: this.questionForm.value.optionFields!,
      };

      this.problemService
        .editProblem(this.activatedRoute.snapshot.paramMap.get('id')!, editData)
        .subscribe(() => {
          this.onSubmitSuccess();
        });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos Inválidos',
        detail:
          'Verifique se todos os campos estão preenchidos apropriadamente.',
      });
    }
  }
}
