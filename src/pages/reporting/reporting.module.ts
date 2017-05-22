import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Reporting } from './reporting';

@NgModule({
  declarations: [
    Reporting,
  ],
  imports: [
    IonicPageModule.forChild(Reporting),
  ],
  exports: [
    Reporting
  ]
})
export class ReportingModule {}
