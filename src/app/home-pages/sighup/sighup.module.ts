import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SighupRoutingModule } from './sighup-routing.module';
import { SighupComponent } from './sighup.component';


@NgModule({
  declarations: [
    SighupComponent
  ],
  imports: [
    CommonModule,
    SighupRoutingModule
  ]
})
export class SighupModule { }
