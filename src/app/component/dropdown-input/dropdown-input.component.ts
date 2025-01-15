import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export interface DropdownOption {
  content: string;
  value: any;
  class?: string;
}
@Component({
  selector: 'app-dropdown-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dropdown-input.component.html',
  styleUrl: './dropdown-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownInputComponent {
  @Input() control!: FormControl;
  @Input() options: DropdownOption[] = [];
  @Input() label: string = '';
  @Input() selectClass: string = '';
}
