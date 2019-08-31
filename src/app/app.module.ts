import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShinobuComponent } from './modules/shinobu/components/shinobu/shinobu.component';
import { KirinoComponent } from './modules/kirino/components/kirino/kirino.component';
import { NotesComponent } from './modules/shinobu/components/notes/notes.component';
import { NoteComponent } from './modules/shinobu/components/note/note.component';
import { FormsModule } from '@angular/forms';
import { ShContextMenuModule } from 'ng2-right-click-menu';
import { Angular2FontawesomeModule } from 'angular2-fontawesome';
import { ColorPickerComponent } from './modules/shinobu/components/color-picker/color-picker.component';
import { TabsComponent } from './modules/shinobu/components/tabs/tabs.component';
import { QuickAccessModalComponent } from './modules/shinobu/components/quick-access-modal/quick-access-modal.component';
import { QuickAccessComponent } from './modules/shinobu/components/quick-access/quick-access.component';
import { TileComponent } from './modules/shinobu/components/tile/tile.component';
import { SortablejsModule } from 'ngx-sortablejs';
import { MenuComponent } from './components/menu/menu.component';
import {ItemBoxComponent} from './modules/kirino/components/item-box/item-box.component';
import { OvaBoxComponent } from './modules/kirino/components/ova-box/ova-box.component';
import { KirinoImageComponent } from './modules/kirino/components/kirino-image/kirino-image.component';
import { MusicBoxComponent } from './modules/kirino/components/music-box/music-box.component';
import { AnimeBoxComponent } from './modules/kirino/components/anime-box/anime-box.component';
import { ShowsBoxComponent } from './modules/kirino/components/shows-box/shows-box.component';
import { BoxComponent } from './modules/kirino/components/box/box.component';
import { KirinoFormComponent } from './modules/kirino/components/kirino-form/kirino-form.component';
import { AnimeFormComponent } from './modules/kirino/components/anime-form/anime-form.component';
import { ShowFormComponent } from './modules/kirino/components/show-form/show-form.component';
import { OvaFormComponent } from './modules/kirino/components/ova-form/ova-form.component';
import { MusicFormComponent } from './modules/kirino/components/music-form/music-form.component';
import { BackgroundComponent } from './modules/background/components/background/background.component';
import { BrowserActionComponent } from './modules/borwser-action/browser-action/browser-action.component';
import { HttpClientModule } from '@angular/common/http';
import { ErrorComponent } from './components/error/error.component';
import { SettingsComponent } from './modules/settings/components/settings/settings.component';
import { ErrorLogComponent } from './modules/settings/components/error-log/error-log.component';

@NgModule({
  declarations: [
    AppComponent,
    ShinobuComponent,
    KirinoComponent,
    NotesComponent,
    NoteComponent,
    ColorPickerComponent,
    TabsComponent,
    QuickAccessModalComponent,
    QuickAccessComponent,
    TileComponent,
    MenuComponent,
    ItemBoxComponent,
    OvaBoxComponent,
    KirinoImageComponent,
    MusicBoxComponent,
    AnimeBoxComponent,
    ShowsBoxComponent,
    BoxComponent,
    KirinoFormComponent,
    AnimeFormComponent,
    ShowFormComponent,
    OvaFormComponent,
    MusicFormComponent,
    BackgroundComponent,
    BrowserActionComponent,
    ErrorComponent,
    SettingsComponent,
    ErrorLogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ShContextMenuModule,
    Angular2FontawesomeModule,
    SortablejsModule.forRoot({ animation: 150 }),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
