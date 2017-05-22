import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

//PAGES
import { HomePage } from '../pages/home/home';
import { Contact } from '../pages/contact/contact';
import { About } from '../pages/about/about';
import { ApexModal } from '../pages/apex-modal/apex-modal';
import { DataSessionModal } from '../pages/data-session-modal/data-session-modal';
import { Managebdd } from '../pages/managebdd/managebdd';
import { Reporting } from '../pages/reporting/reporting';

//PROVIDERS
import { Dateformat } from '../providers/dateformat';
import { LocationTracker } from '../providers/location-tracker';

//IONIC NATIVE PLUGINS
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Device } from '@ionic-native/device';
import { SQLite } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    About,
    ApexModal,
    DataSessionModal,
    Managebdd,
    Contact,
    Reporting
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    About,
    ApexModal,
    DataSessionModal,
    Managebdd,
    Contact,
    Reporting
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Dateformat,
    LocationTracker,
    Geolocation,
    BackgroundGeolocation,
    Device,
    SQLite,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
