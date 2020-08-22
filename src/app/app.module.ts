import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppMaterialModule } from './material-module';

import { SurfaceDrawModule } from 'my-libs/surface-draw';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { StateMachineComponent } from './state-machine/state-machine.component';
import { ModelToolsComponent } from './model-tools/model-tools.component';
import { ModelPropertiesComponent } from './model-properties/model-properties.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StateMachineComponent,
    ModelToolsComponent,
    ModelPropertiesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppMaterialModule,
    SurfaceDrawModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
