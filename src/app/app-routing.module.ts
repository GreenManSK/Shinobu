import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShinobuComponent } from './modules/shinobu/components/shinobu/shinobu.component';
import { KirinoComponent } from './modules/kirino/components/kirino/kirino.component';
import { KirinoFormComponent } from './modules/kirino/components/kirino-form/kirino-form.component';
import { BackgroundComponent } from './modules/background/components/background/background.component';
import { BrowserActionComponent } from './modules/borwser-action/browser-action/browser-action.component';


const routes: Routes = [
  {path: '', component: ShinobuComponent},
  {path: 'kirino', component: KirinoComponent},
  {path: 'kirino-form/:type', component: KirinoFormComponent},
  {path: 'kirino-form/:type/:id', component: KirinoFormComponent},
  {path: 'background', component: BackgroundComponent},
  {path: 'browser-action', component: BrowserActionComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
