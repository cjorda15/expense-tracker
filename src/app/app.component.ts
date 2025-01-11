import { Component,Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ThemeService } from './service/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'expense-tracker';
  constructor(private themeService: ThemeService,public auth: AuthService,@Inject(DOCUMENT) public document: Document){
   
  }
  ngOnInit(): void {
    this.themeService.initializeTheme();
  }
}
