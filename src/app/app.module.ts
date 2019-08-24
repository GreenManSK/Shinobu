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
import { TabsComponent } from './shinobu/components/tabs/tabs.component';
import { QuickAccessModalComponent } from './shinobu/components/quick-access-modal/quick-access-modal.component';
import { QuickAccessComponent } from './shinobu/components/quick-access/quick-access.component';
import { TileComponent } from './shinobu/components/tile/tile.component';
import { SortablejsModule } from 'ngx-sortablejs';
import { MenuComponent } from './components/menu/menu.component';
import {ItemBoxComponent} from './kirino/components/item-box/item-box.component';
import { OvaBoxComponent } from './kirino/components/ova-box/ova-box.component';
import { KirinoImageComponent } from './kirino/components/kirino-image/kirino-image.component';
import { MusicBoxComponent } from './kirino/components/music-box/music-box.component';
import { AnimeBoxComponent } from './kirino/components/anime-box/anime-box.component';
import { ShowsBoxComponent } from './kirino/components/shows-box/shows-box.component';
import { BoxComponent } from './kirino/components/box/box.component';
import { KirinoFormComponent } from './kirino/components/kirino-form/kirino-form.component';
import { AnimeFormComponent } from './kirino/components/anime-form/anime-form.component';
import { ShowFormComponent } from './kirino/components/show-form/show-form.component';
import { OvaFormComponent } from './kirino/components/ova-form/ova-form.component';

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
    OvaFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ShContextMenuModule,
    Angular2FontawesomeModule,
    SortablejsModule.forRoot({ animation: 150 })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
