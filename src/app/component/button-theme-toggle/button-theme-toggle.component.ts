import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { ThemeService } from '../../service/theme.service';

@Component({
  selector: 'app-button-theme-toggle',
  imports: [ButtonComponent],
  templateUrl: './button-theme-toggle.component.html',
  styleUrl: './button-theme-toggle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonThemeToggleComponent {
  constructor(public themeService: ThemeService) {}
  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }
}
