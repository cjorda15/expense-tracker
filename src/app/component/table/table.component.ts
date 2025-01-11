import { Component, Input } from '@angular/core';
import { TableHeader, TableRow } from '../../types';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent<T> {
  @Input() headers: TableHeader[] = [];
  @Input() rows: TableRow[] = [];
  ngOnInit(){
  }
  onSort(key:any): void {
    this.rows.sort((a, b) =>
      a[key].content > b[key].content ? 1 : a[key].content < b[key].content ? -1 : 0
    );
  }
}
