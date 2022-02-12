import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppMaterialModule } from './material-module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { declarations } from './core';
import { SurfaceDrawModule } from 'my-libs/surface-draw';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { StateMachineComponent } from './state-machine/state-machine.component';
import { ModelToolsComponent } from './model-tools/model-tools.component';
import { ModelPropertiesComponent } from './model-properties/model-properties.component';
import { ThemeService, AppThemes } from './theme.service';
import { OverlayContainer } from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StateMachineComponent,
    ModelToolsComponent,
    ModelPropertiesComponent,
    declarations
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    AppMaterialModule,
    SurfaceDrawModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(overlayContainer: OverlayContainer, private themeService: ThemeService) {
    themeService.getTheme().subscribe(data => {
      if (data === AppThemes.light) {
        overlayContainer.getContainerElement().classList.remove(AppThemes.dark);
      }
      else{
        overlayContainer.getContainerElement().classList.add(AppThemes.dark);
      }
    });
  }
}
