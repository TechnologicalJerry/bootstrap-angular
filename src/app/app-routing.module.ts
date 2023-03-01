import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard-pages',
    loadChildren: () => import('./dashboard-pages/dashboard-pages.module').then(m => m.DashboardPagesModule)
  },
  {
    path: 'home-pages',
    loadChildren: () => import('./home-pages/home-pages.module').then(m => m.HomePagesModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
