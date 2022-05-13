import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ShinobuMainComponent } from './components/shinobu/shinobu-main/shinobu-main.component';
import { QuickAccessComponent } from './components/shinobu/quick-access/quick-access.component';
import { TileComponent } from './components/shinobu/tile/tile.component';
import { QuickAccessModalComponent } from './components/shinobu/quick-access-modal/quick-access-modal.component';
import { FormsModule } from '@angular/forms';
import { NgxEmojModule } from 'ngx-emoj';
import { ShContextMenuModule } from 'ng2-right-click-menu';
import { LongPressContextMenuDirective } from './directives/long-press-context-menu.directive';
import { SortablejsModule } from 'ngx-sortablejs';
import { IconPickerComponent } from './components/shinobu/icon-picker/icon-picker.component';
import { TabsComponent } from './components/shinobu/tabs/tabs.component';
import { TabComponent } from './components/shinobu/tab/tab.component';
import { NotesComponent } from './components/shinobu/notes/notes.component';
import { NoteComponent } from './components/shinobu/note/note.component';
import { ColorPickerComponent } from './components/shinobu/color-picker/color-picker.component';
import { AlertCenterComponent } from './components/alert-center/alert-center.component';
import { MenuComponent } from './components/menu/menu.component';
import { SettingsComponent } from './components/settings/settings/settings.component';
import { ShinobuPreferenceComponent } from './components/settings/shinobu-preference/shinobu-preference.component';
import { BoxComponent } from './components/box/box.component';
import { AuthenticationComponent } from './components/settings/authentiaction/authentication.component';
import { FirebaseMigrationComponent } from './components/settings/firebase-migration/firebase-migration.component';
import { ChromeMigrationComponent } from './components/settings/chrome-migration/chrome-migration.component';
import { KirinoComponent } from './components/kirino/kirino/kirino.component';
import { KirinoImageComponent } from './components/kirino/kirino-image/kirino-image.component';
import { ItemBoxComponent } from './components/kirino/item-box/item-box.component';
import { AnimeBoxComponent } from './components/kirino/anime-box/anime-box.component';
import { KirinoFormComponent } from './components/kirino/kirino-form/kirino-form.component';
import { AnimeFormComponent } from './components/kirino/anime-form/anime-form.component';
import { MusicFormComponent } from './components/kirino/music-form/music-form.component';
import { MusicBoxComponent } from './components/kirino/music-box/music-box.component';

@NgModule({
  declarations: [
    AppComponent,
    ShinobuMainComponent,
    QuickAccessComponent,
    TileComponent,
    QuickAccessModalComponent,
    LongPressContextMenuDirective,
    IconPickerComponent,
    TabsComponent,
    TabComponent,
    NotesComponent,
    NoteComponent,
    ColorPickerComponent,
    AlertCenterComponent,
    MenuComponent,
    SettingsComponent,
    ShinobuPreferenceComponent,
    BoxComponent,
    AuthenticationComponent,
    FirebaseMigrationComponent,
    ChromeMigrationComponent,
    KirinoComponent,
    KirinoImageComponent,
    ItemBoxComponent,
    AnimeBoxComponent,
    KirinoFormComponent,
    AnimeFormComponent,
    MusicFormComponent,
    MusicBoxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence({
      synchronizeTabs: true
    }),
    AngularFireAuthModule,
    FormsModule,
    NgxEmojModule,
    ShContextMenuModule,
    HammerModule,
    SortablejsModule.forRoot({ animation: 150 }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
