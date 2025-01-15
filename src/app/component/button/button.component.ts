import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
  @Input() customClass: string = '';
  @Input() disabled: boolean = false;
  @Input() processing: boolean = false;
  @Output() click: EventEmitter<null> = new EventEmitter();

  public getSizeClass(): string {
    switch (this.size) {
      case 'small':
        return 'px-3 py-1 text-sm';
      case 'large':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  }

  public getVariantClass(): string {
    switch (this.variant) {
      case 'secondary':
        return 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400';
      case 'danger':
        return 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300';
      case 'ghost':
        return 'bg-transparent active-none outline-none border-none text-gray-800 hover:bg-gray-100 focus:ring-gray-400';

      default:
        return 'border-solid-1px-green bg-white  dark:bg-navy dark:text-green text-black hover:shadow-[3px_3px_0_0_var(--navy)] dark:hover:shadow-[3px_3px_0_0_var(--green)]';
    }
  }
  public handleClick($event: Event) {
    $event.preventDefault();
    $event.stopImmediatePropagation();
    this.click.emit();
  }
}
