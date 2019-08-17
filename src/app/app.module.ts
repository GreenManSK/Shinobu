import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShinobuComponent } from './shinobu/components/shinobu/shinobu.component';
import { KirinoComponent } from './kirino/components/kirino/kirino.component';
import { NotesComponent } from './shinobu/components/notes/notes.component';
import { NoteComponent } from './shinobu/components/note/note.component';
import { FormsModule } from '@angular/forms';
import { ShContextMenuModule } from 'ng2-right-click-menu';
import { Angular2FontawesomeModule } from 'angular2-fontawesome';
import { ColorPickerComponent } from './shinobu/components/color-picker/color-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    ShinobuComponent,
    KirinoComponent,
    NotesComponent,
    NoteComponent,
    ColorPickerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ShContextMenuModule,
    Angular2FontawesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
