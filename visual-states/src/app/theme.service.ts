import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export enum AppThemes {
  light = 'light-theme',
  dark = 'dark-theme',
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  currentTheme: AppThemes;
  currentThemeSubject = new Subject<string>();

  constructor() { }

  toggleTheme(): void {
    if (this.currentTheme === AppThemes.light) {
      this.currentTheme = AppThemes.dark;
      this.currentThemeSubject.next(AppThemes.dark);
      document.body.classList.remove('light-theme');
    } else {
      this.currentTheme = AppThemes.light;
      this.currentThemeSubject.next(AppThemes.light);
      document.body.classList.add('light-theme');
    }
  }

  get isLight(): boolean {
    return this.currentTheme === AppThemes.light;
  }

  getTheme(): Observable<string> {
    return this.currentThemeSubject.asObservable();
  }

  public getSurfaceFill(): string {
    return this.isLight ? '#FAFAFA' : '#303030';
  }

  public getSurfaceStroke(): string {
    return this.isLight ? '#303030' : '#FAFAFA';
  }

  public getElementStroke(): string {
    return this.isLight ? '#9E9E9E' : '#F3E5F5';
  }

  public getElementFill(): string {
    return this.isLight ? '#FAFAFA' : '#424242';
  }
}
