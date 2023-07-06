import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeFooterRoutingModule } from './home-footer-routing.module';
import { HomeFooterComponent } from './home-footer.component';


@NgModule({
  declarations: [
    HomeFooterComponent
  ],
  imports: [
    CommonModule,
    HomeFooterRoutingModule
  ]
})
export class HomeFooterModule { }
