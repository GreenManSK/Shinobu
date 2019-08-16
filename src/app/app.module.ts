import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShinobuComponent } from './shinobu/components/shinobu/shinobu.component';
import { KirinoComponent } from './kirino/components/kirino/kirino.component';

@NgModule({
  declarations: [
    AppComponent,
    ShinobuComponent,
    KirinoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
