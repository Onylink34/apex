import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Managebdd } from './managebdd';

@NgModule({
  declarations: [
    Managebdd,
  ],
  imports: [
    IonicPageModule.forChild(Managebdd),
  ],
  exports: [
    Managebdd
  ]
})
export class ManagebddModule {}
