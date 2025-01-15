import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './date-input.component.html',
  styleUrl: './date-input.component.css'
})
export class DateInputComponent {
  @Input() control!: FormControl;
  @Input() label: string = '';
  @Input() class: string = '';
  @Input() type: string = 'text';
  @Input() min: string = 'text';
  @Input() max: string = 'text';
  @ViewChild('inputField') inputFieldRef!: ElementRef;

  focusInput() {
    (this.inputFieldRef.nativeElement as HTMLInputElement).focus();
  }
}
