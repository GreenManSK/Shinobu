import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShinobuMainComponent } from './components/shinobu/shinobu-main/shinobu-main.component';
import { SettingsComponent } from './components/settings/settings/settings.component';
import { KirinoComponent } from './components/kirino/kirino/kirino.component';
import { KirinoFormComponent } from './components/kirino/kirino-form/kirino-form.component';
import { BackgroundComponent } from './components/background/background.component';
import { BrowserActionComponent } from './components/browser-action/browser-action.component';

const routes: Routes = [
  {path: '', component: ShinobuMainComponent},
  {path: 'kirino', component: KirinoComponent},
  {path: 'kirino-form/:type', component: KirinoFormComponent},
  {path: 'kirino-form/:type/:id', component: KirinoFormComponent},
  {path: 'background', component: BackgroundComponent},
  {path: 'browser-action', component: BrowserActionComponent},
  {path: 'settings', component: SettingsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
