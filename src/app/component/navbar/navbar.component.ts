import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonAuthComponent } from '../button-auth/button-auth.component';
import { ButtonThemeToggleComponent } from '../button-theme-toggle/button-theme-toggle.component';

@Component({
  selector: 'app-navbar',
  imports: [ButtonThemeToggleComponent, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  constructor() {}
}
