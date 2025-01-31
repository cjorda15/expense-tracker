import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Signal,
  WritableSignal,
  effect,
  inject,
  signal
} from '@angular/core';
import {
  TableComponent,
  TableHeader,
  TableRow,
  TableSort
} from '@component/table/table.component';
import { TransactionStore } from '@store/transaction';
import { Transaction } from '@store/transaction.model';
import { Subject } from 'rxjs';
import { ButtonComponent } from '@component/button/button.component';
import { DialogService } from '@service/dialog.service';
import { TransactionModalComponent } from '@component/modal-transaction/modal-transaction.component';
import { computed } from '@angular/core';
import { ResultCountComponent } from '@component/result-count/result-count.component';
import { SearchInputComponent } from '@component/search-input/search-input.component';
import { Form, FormControl } from '@angular/forms';
import { PaginatorComponent } from '@component/paginator/paginator.component';

@Component({
  selector: 'app-table-transaction',
  imports: [
    TableComponent,
    ButtonComponent,
    SearchInputComponent,
    ResultCountComponent,
    PaginatorComponent
  ],
  templateUrl: './table-transaction.component.html',
  styleUrl: './table-transaction.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableTransactionComponent implements OnInit, OnDestroy {
  constructor(private dialogService: DialogService) {
    effect(() => {
      const transactions = this.transactionStore.transactions();
      const query = this.filterQuery();

      const filteredTransactions = query
        ? transactions.filter((t) => this.matchesFilter(t, query))
        : transactions;

      this.totalCount = filteredTransactions.length;
    });
  }
  private filterQuery = signal<string>('');
  private transactionStore = inject(TransactionStore);
  public currentPage: WritableSignal<number> = signal(1);
  public pageSize: WritableSignal<number> = signal(5);
  public totalCount: number = 0;
  public sortState: TableSort = { header: '', sortAsc: true };
  public filterControl: FormControl<string> = new FormControl();
  public tableHeaders: TableHeader[] = [
    { key: 'type', label: 'Type', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'date', label: 'Date', sortable: true }
  ];
  public destroy$ = new Subject();

  get rows(): Signal<TableRow[]> {
    return computed(() => {
      const transactions = this.transactionStore.transactions();
      const query = this.filterQuery();
      const { header, sortAsc } = this.sortState;

      // Filter transactions based on the search query
      let filteredTransactions = query
        ? transactions.filter((t) => this.matchesFilter(t, query))
        : transactions;

      // Sort transactions if a header is specified
      if (header) {
        filteredTransactions = [...filteredTransactions].sort((a, b) => {
          const valueA = this.getTransactionValue(a, header);
          const valueB = this.getTransactionValue(b, header);

          if (valueA < valueB) return sortAsc ? -1 : 1;
          if (valueA > valueB) return sortAsc ? 1 : -1;
          return 0;
        });
      }

      // Paginate the sorted transactions
      const start = (this.currentPage() - 1) * this.pageSize();
      const end = start + this.pageSize();
      return filteredTransactions.slice(start, end).map(this.mapToTableRow);
    });
  }

  getTransactionValue(transaction: Transaction, key: string): any {
    const value: any = transaction[key as keyof Transaction];

    if (typeof value === 'string') {
      return value.toLowerCase(); // Ensure case-insensitive sorting for strings
    }

    if (value instanceof Date) {
      return value.getTime(); // Sort dates numerically
    }

    return value; // Return as-is for numbers
  }

  ngOnInit(): void {
    this.filterControl.valueChanges.subscribe((input) => {
      this.filterQuery.set(input);
      this.currentPage.set(1);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

matchesFilter(transaction: Transaction, query: string): boolean {
    // If query is a number, filter by amount
  if (!isNaN(Number(query))) {
    debugger
    const amountFilter = Number(query);
    return transaction.amount >= amountFilter;
  }

  const searchTerms = query.split(/\s+/).filter((term) => term.length > 0);



  // Otherwise, filter by text fields
  return searchTerms.some(
    (term) =>
      transaction.type.toLowerCase().includes(term) ||
      transaction.category.toLowerCase().includes(term) ||
      transaction.description.toLowerCase().includes(term)
  );
}

  openNewTransacation() {
    this.dialogService.open(TransactionModalComponent);
  }

  pageChange(newPage: number) {
    this.currentPage.set(newPage);
  }

  onPageChange(newPage: number): void {
    this.currentPage.set(newPage);
  }

  onSort(header: string) {
    const sortAsc =
      this.sortState.header === header ? !this.sortState.sortAsc : true;
    this.sortState = { header, sortAsc };
  }

  mapToTableRow(transaction: Transaction): TableRow {
    return {
      id: transaction.id,
      columns: {
        date: {
          content: transaction.date,
          type: 'date'
        },
        category: {
          content: transaction.category,
          class: 'capitalize'
        },
        type: {
          content: transaction.type,
          class: 'capitalize'
        },
        description: {
          content: transaction.description
        },

        amount: {
          content: transaction.amount,
          type: 'number'
        }
      }
    };
  }
}
