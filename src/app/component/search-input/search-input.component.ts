import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class SearchInputComponent {
  @Input() control!: FormControl;

  clearSearch() {
    this.control.setValue(null);
  }
}
