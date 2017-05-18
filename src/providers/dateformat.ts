import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { DatePipe } from '@angular/common';
/*
  Generated class for the Dateformat provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Dateformat {

  constructor() {
  }


    gettime() {
      var myDate = new Date();
      var datePipe = new DatePipe('fr-FR');
      return datePipe.transform(myDate, 'HH:mm:ss');
    }

    getdate() {
      var myDate = new Date();
      var datePipe = new DatePipe('fr-FR');
      return datePipe.transform(myDate, 'yyyy-MM-dd');
    }
}
