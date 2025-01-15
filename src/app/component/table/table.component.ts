import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginatorComponent } from '@component/paginator/paginator.component';
import { SearchInputComponent } from '@component/search-input/search-input.component';

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
    [key: string]: TableRowColumn;
  };
}

export interface TableSort {
  header: string;
  sortAsc: boolean;
}
@Component({
  selector: 'app-table',
  imports: [CommonModule, FormsModule,PaginatorComponent,SearchInputComponent,],
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
  @Input() enablePagination: boolean = true; // Enable/disable pagination
  @Input() rowsPerPage: number = 5; // Number of rows per page
  @Output() onSort = new EventEmitter();
  @Output() onToggleSort = new EventEmitter();
  @Output() onInputChange = new EventEmitter();
  @Output() onPageChange = new EventEmitter<number>(); // Page change event

  currentPage: number = 1; // Current page

  ngOnInit() {}

  page: number = 1;

  handlePageChange(newPage: number) {
  console.log('New Page:', newPage);
  this.page = newPage;
  // Add logic to fetch data for the new page
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
    this.sortState.sortAsc = !this.sortState.sortAsc;
  }

  handleInputChange() {
    this.onInputChange.emit();
  }

  get paginatedRows(): TableRow[] {
    if (!this.enablePagination) {
      return this.rows; // Return all rows if pagination is disabled
    }
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    return this.rows.slice(startIndex, startIndex + this.rowsPerPage);
  }

  pageChange(newPage: number) {
    this.currentPage = newPage;
    this.onPageChange.emit(newPage); // Emit the new page number
  }
}
