import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShinobuComponent } from './shinobu/components/shinobu/shinobu.component';
import { KirinoComponent } from "./kirino/components/kirino/kirino.component";


const routes: Routes = [
  {path: '', component: ShinobuComponent},
  {path: 'kirino', component: KirinoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
