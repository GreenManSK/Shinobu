import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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

@NgModule({
  declarations: [
    AppComponent,
    ShinobuMainComponent,
    QuickAccessComponent,
    TileComponent,
    QuickAccessModalComponent
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
    NgxEmojModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
