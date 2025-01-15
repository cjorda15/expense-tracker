import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Signal,
  inject
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

@Component({
  selector: 'app-table-transaction',
  imports: [TableComponent, ButtonComponent],
  templateUrl: './table-transaction.component.html',
  styleUrl: './table-transaction.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableTransactionComponent implements OnInit, OnDestroy {
  private transactionStore = inject(TransactionStore);
  public sortState: TableSort = { header: '', sortAsc: true };
  constructor(private dialogService: DialogService) {}
  public tableHeaders: TableHeader[] = [
    { key: 'type', label: 'Type', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'date', label: 'Date', sortable: true }
  ];
  public destroy$ = new Subject();
  get rows(): Signal<TableRow[]> {
    return computed(() =>
      this.transactionStore.transactions().map(this.mapToTableRow)
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  openNewTransacation() {
    this.dialogService.open(TransactionModalComponent);
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
