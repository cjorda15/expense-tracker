import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeKey = 'dark-mode';
  public isDarkMode$: BehaviorSubject<boolean>;

  constructor() {
    // init theme from localStorage
    const savedMode = this.getSavedTheme();
    this.isDarkMode$ = new BehaviorSubject(savedMode);
    this.applyTheme(savedMode);
  }

  toggleDarkMode(): void {
    const newMode = !this.isDarkMode$.value;
    this.setDarkMode(newMode);
  }

  setDarkMode(isDark: boolean): void {
    localStorage.setItem(this.darkModeKey, JSON.stringify(isDark));
    this.applyTheme(isDark);
    this.isDarkMode$.next(isDark);
  }

  private applyTheme(isDark: boolean): void {
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }

  private getSavedTheme(): boolean {
    const savedMode = localStorage.getItem(this.darkModeKey);
    return savedMode !== null ? JSON.parse(savedMode) : false;
  }
}
