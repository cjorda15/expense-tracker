import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  inject
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { DateInputComponent } from '@component/date-input/date-input.component';
import {
  DropdownInputComponent,
  DropdownOption
} from '@component/dropdown-input/dropdown-input.component';
import { InputComponent } from '@component/input/input.component';
import { ModalComponent } from '@component/modal/modal.component';
import { DialogRef, DIALOG_DATA } from '@service/dialog.service';
import {
  ExpenseCategory,
  IncomeCategory,
  Transaction,
  TransactionType
} from '@store/transaction.model';
import { Subject, takeUntil, tap } from 'rxjs';
import { format } from 'date-fns';
import { ButtonComponent } from '@component/button/button.component';
import { TransactionStore } from '@store/transaction';

@Component({
  selector: 'app-modal-transaction',
  imports: [
    ModalComponent,
    DropdownInputComponent,
    InputComponent,
    DateInputComponent,
    ButtonComponent
  ],
  templateUrl: './modal-transaction.component.html',
  styleUrl: './modal-transaction.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionModalComponent implements OnInit {
  public isSubmitting: boolean = false; // meant to
  public form: FormGroup = this.fb.group({
    type: this.fb.control('', Validators.required),
    amount: this.fb.control(1, Validators.required),
    category: this.fb.control('', Validators.required),
    description: this.fb.control(''),
    date: this.fb.control(format(new Date(), 'yyyy-MM-dd'), Validators.required)
  });
  public typeOptions: DropdownOption[] = [
    { content: TransactionType.Income, value: TransactionType.Income },
    { content: TransactionType.Expense, value: TransactionType.Expense }
  ];
  public destroy$ = new Subject();
  public incomeCategoriesOptions: DropdownOption[] = Object.values(
    IncomeCategory
  )
    .map((category) => ({
      content: category,
      value: category,
      class: 'capitalize'
    }))
    .sort((a, b) => (a.value > b.value ? 1 : -1));
  public expenseCategoriesOptions: DropdownOption[] = Object.values(
    ExpenseCategory
  )
    .map((category) => ({
      content: category,
      value: category,
      class: 'capitalize'
    }))
    .sort((a, b) => (a.value > b.value ? 1 : -1));
  private transactionStore = inject(TransactionStore);
  public categoriesOptions: DropdownOption[] = [
    ...this.incomeCategoriesOptions,
    ...this.expenseCategoriesOptions
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: string
  ) {}

  get typeControl(): FormControl<string> {
    return this.form.get('type') as FormControl<string>;
  }
  get amountControl(): FormControl<number> {
    return this.form.get('amount') as FormControl<number>;
  }
  get categoryControl(): FormControl<string> {
    return this.form.get('category') as FormControl<string>;
  }
  get descriptionControl(): FormControl<string> {
    return this.form.get('description') as FormControl<string>;
  }
  get dateControl(): FormControl<string> {
    return this.form.get('date') as FormControl<string>;
  }

  ngOnInit() {
    this.checkToUpdateCategoryControl();
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  // reset category control if current value not an option for newly current type
  checkToUpdateCategoryControl() {
    this.typeControl?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap((type) => {
          // avoid with no type set
          if (!type) return;
          if (type === TransactionType.Income) {
            this.categoriesOptions = [...this.incomeCategoriesOptions];
          }
          if (type === TransactionType.Expense) {
            this.categoriesOptions = [...this.expenseCategoriesOptions];
          }

          // avoid checking to reset with no value for category
          if (!this.categoryControl.value) return;
          if (
            type === TransactionType.Income &&
            !this.incomeCategoriesOptions.find(
              ({ value }) => value === this.categoryControl.value
            )
          ) {
            this.categoryControl.setValue('');
          }
          if (
            type === TransactionType.Expense &&
            !this.expenseCategoriesOptions.find(
              ({ value }) => value === this.categoryControl.value
            )
          ) {
            this.categoryControl.setValue('');
          }
        })
      )
      .subscribe();
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    this.isSubmitting = true;
    setTimeout(
      () => {
        const { date, type, category, description, amount } = this.form.value;

        const transaction: Transaction = {
          id: 99,
          date,
          type,
          category,
          description,
          amount
        };

        this.transactionStore.addTransaction(transaction);
        this.close();
      },

      2000
    );
  }
}
