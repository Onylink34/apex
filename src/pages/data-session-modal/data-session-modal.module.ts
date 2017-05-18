import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataSessionModal } from './data-session-modal';

@NgModule({
  declarations: [
    DataSessionModal,
  ],
  imports: [
    IonicPageModule.forChild(DataSessionModal),
  ],
  exports: [
    DataSessionModal
  ]
})
export class DataSessionModalModule {}
