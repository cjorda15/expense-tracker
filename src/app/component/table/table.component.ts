import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableRowColumn {
  content: any; // content displayed in the rows columns
  value?: any; // value to be used for inputs
  type?: 'text' | 'pill' | 'date' | 'number'; //type to be used
  class?: string; // class to be set on content
}

export interface TableHeader {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface TableRow {
  id: number;
  columns: {
    [key: string]: TableRowColumn; //dynamic keys for columns
  };
}

export interface TableSort {
  header: string;
  sortAsc: boolean;
}
@Component({
  selector: 'app-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
  @Input() inputRow: any;
  @Input() headers: TableHeader[] = [];
  @Input() rows: TableRow[] = [];
  @Input() sortState: TableSort = { header: '', sortAsc: true };
  @Input() class: string = '';
  @Input() enablePagination: boolean = true;
  @Input() rowsPerPage: number = 5;
  @Output() onSort = new EventEmitter();
  @Output() onToggleSort = new EventEmitter();
  @Output() onInputChange = new EventEmitter();
  public currentPage: number = 1;

  ngOnInit() {}

  get paginatedRows(): TableRow[] {
    if (!this.enablePagination) {
      return this.rows;
    }
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    return this.rows.slice(startIndex, startIndex + this.rowsPerPage);
  }

  handleSort($event: Event, header: TableHeader): void {
    $event.preventDefault();
    $event.stopImmediatePropagation();
    if (header.sortable) {
      this.onSort.emit(header.key);
    }
  }

  handleToggleSort() {
    this.onToggleSort.emit();
  }

  handleInputChange() {
    this.onInputChange.emit();
  }
}
