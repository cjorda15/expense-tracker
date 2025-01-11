import { Component, Inject } from '@angular/core';
import { ThemeService } from '../../service/theme.service';
import { ButtonComponent } from '../button/button.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ButtonComponent,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(public themeService: ThemeService,public auth: AuthService,@Inject(DOCUMENT) public document: Document) {}

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }
}