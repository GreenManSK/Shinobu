import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShinobuMainComponent } from './components/shinobu/shinobu-main/shinobu-main.component';
import { SettingsComponent } from './components/settings/settings/settings.component';

const routes: Routes = [
  {path: '', component: ShinobuMainComponent},
  {path: 'settings', component: SettingsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
