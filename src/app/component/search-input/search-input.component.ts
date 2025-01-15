import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  imports:[CommonModule,FormsModule]
})
export class SearchInputComponent {
  searchTerm: string = '';
  data: any[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Michael Johnson', email: 'michael@example.com' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com' },
  ];

  filteredData = [...this.data]; // Create a copy of data for filtering

  onSearch() {
    this.filteredData = this.data.filter((item) =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredData = [...this.data]; // Reset the filtered data when cleared
  }
}
