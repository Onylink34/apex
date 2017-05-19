import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

declare var google;

@IonicPage()
@Component({
  selector: 'page-data-session-modal',
  templateUrl: 'data-session-modal.html',
})
export class DataSessionModal {
  @ViewChild('map') mapElement;
  map : any;
  id_phone: string = this.navParams.get('idphone');
  id_session: string = this.navParams.get('idsession');
  dataList = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private sqlite : SQLite, private viewCtrl:ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DataSessionModal');
    this.id_session = this.navParams.get('idsession');
    this.startsession(this.id_session);

  }

  initmap(markerlist){

    var lat = markerlist[0].latitude;
    var lng = markerlist[0].longitude;
    var center = {lat: lat, lng: lng};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 20,
      center: center
    });

    var marker;

    for (let variable of markerlist) {
      var uluru = {lat: variable.latitude, lng: variable.longitude};
      marker = new google.maps.Marker({
        position: uluru,
        map: map
      });
    }
   }

  startsession(ids){
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {

      db.executeSql('CREATE TABLE IF NOT EXISTS datasession(id INTEGER PRIMARY KEY AUTOINCREMENT,id_session,apex,latitude,longitude,hour)', {})
      .then(() => console.log('Executed SQL'))
      .catch(e => console.log(e));

      db.executeSql('select * from datasession where id_session = ? ', [ids]).then((data) => {
        console.log(JSON.stringify(data));
        if(data.rows.length > 0) {
          this.dataList = [];
          for(var i = 0; i < data.rows.length; i++) {
            this.dataList.push({
              id:data.rows.item(i).id,
              id_session: data.rows.item(i).id_session,
              apex: data.rows.item(i).apex,
              latitude: data.rows.item(i).latitude,
              longitude: data.rows.item(i).longitude,
              hour: data.rows.item(i).hour
            });
          }
          this.initmap(this.dataList);
        }
      }).catch(e => console.log(e));

      return true;
    })
    .catch(e => console.log(JSON.stringify(e)));
  }

  stopsesion(){
    this.viewCtrl.dismiss();
  }
}
