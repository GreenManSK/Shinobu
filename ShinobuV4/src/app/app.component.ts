import { Component } from '@angular/core';
import { TabService } from './services/data/shinobu/tab.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Tab } from './data/shinobu/Tab';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ShinobuV4';

  constructor(private tabService: TabService, public auth: AngularFireAuth) {
    tabService.onReady().then(() => {
      tabService.getAll().subscribe(items => {
        console.log("items", items);
      });
    });
  }

  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(() => window.location.reload());
  }

  logout() {
    this.auth.signOut().then(() => window.location.reload());
  }

  addTab() {
    this.tabService.save(new Tab(`Tab ${Math.random()}`));
  }
}
