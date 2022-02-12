import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService, AppThemes } from './theme.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'visual-states';
  lightThemeEnabled = false;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.getTheme().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      if (data === AppThemes.light)
      {
        this.lightThemeEnabled = true;
      } else{
        this.lightThemeEnabled = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
