import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';

const routes: Routes = [
  { path: 'header', component: HeaderComponent, pathMatch: 'full' },
  {
    path: 'dashboard-pages',
    loadChildren: () => import('./dashboard-pages/dashboard-pages.module').then(m => m.DashboardPagesModule)
  },
  {
    path: 'home-pages',
    loadChildren: () => import('./home-pages/home-pages.module').then(m => m.HomePagesModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
