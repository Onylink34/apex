import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApexModal } from './apex-modal';

@NgModule({
  declarations: [
    ApexModal,
  ],
  imports: [
    IonicPageModule.forChild(ApexModal),
  ],
  exports: [
    ApexModal
  ]
})
export class ApexModalModule {}
