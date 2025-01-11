import { Component, Input } from '@angular/core';
import { NavbarComponent } from '../../component/navbar/navbar.component';
import { EntryPanelComponent } from './component/entry-panel/entry-panel.component';
import { TableComponent } from '../../component/table/table.component';
import { TableHeader, TableRow } from '../../types';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    EntryPanelComponent,
    NavbarComponent,
    TableComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public  tableHeaders: TableHeader[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: false },
    { key: 'age', label: 'Age', sortable: true },
    { key: 'joinedDate', label: 'Joined Date', sortable: true },
  ];
  
  public tableRows:TableRow[] =[ {
    data:null,
    columns: {
      name: { content: 'Alice', type: 'text' },
      age: { content: 25, type: 'number' },
      email: { content: 'crobertjordan@hao.c', type: 'text' },
      joinedDate: { content: '2025-01-07T14:30:00', type: 'date' },

    },
  }];
}
