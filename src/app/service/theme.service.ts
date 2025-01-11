import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkModeKey = 'dark-mode';

  toggleDarkMode(): void {
    const isDark = this.isDarkMode();
    const newMode = !isDark;
    this.setDarkMode(newMode);
  }

  setDarkMode(isDark: boolean): void {
    localStorage.setItem(this.darkModeKey, JSON.stringify(isDark));
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }

  isDarkMode(): boolean {
    return document.documentElement.classList.contains('dark');
  }

  initializeTheme(): void {
    const savedMode = localStorage.getItem(this.darkModeKey);
    if (savedMode !== null) {
      this.setDarkMode(JSON.parse(savedMode));
    }
  }
}
