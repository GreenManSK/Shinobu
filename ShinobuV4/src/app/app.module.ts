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
    TabComponent
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
    AngularFirestoreModule.enablePersistence(),
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
