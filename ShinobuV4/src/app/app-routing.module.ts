import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShinobuMainComponent } from './components/shinobu/shinobu-main/shinobu-main.component';

const routes: Routes = [
  {path: '', component: ShinobuMainComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
