import { Component } from '@angular/core';
import { NavController, Platform, ModalController,LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Device } from '@ionic-native/device';

import { ApexModal } from '../apex-modal/apex-modal';
import { DataSessionModal } from '../data-session-modal/data-session-modal';

import { LocationTracker } from '../../providers/location-tracker';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  //VARIABLES
  dataListSession = [];
  idphone="";
  dataList = [];
  uuid="";
  zen;

  //CONSTRUCTOR
  constructor(
    public navCtrl: NavController,
    private sqlite: SQLite,
    public device: Device,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private locationTracker:LocationTracker,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController) {

    }

    ionViewDidLoad(){
      this.initialize_Id();
    }

    ionViewWillEnter(){
      this.initialize_Id();
    }

    ionViewDidEnter(){
      this.initialize_Id();
      //this.locationTracker.startTracking();
      //this.temppre();
    }

    startSession(){
      let obj = {idphone: this.idphone};
      let myModal = this.modalCtrl.create(ApexModal, obj);
      myModal.present();
    }

    // wiit(){
    //   let loading = this.loadingCtrl.create({
    //     content: 'Please wait...'
    //   });
    //
    //   loading.present();
    //   var go = false;
    //   setTimeout(() => {
    //     loading.dismiss();
    //   }, 1000);
    // }

    popme(e){
      // let id_session = e.id;
      let obj = {idphone: this.idphone, idsession: e.id};
      let myModal = this.modalCtrl.create(DataSessionModal, obj);
      myModal.present();
    }

    temppre(){
      var toto = "gg";
      this.dataList.push({
        id:1,
        id_phone: "id1",
        start: "_1start",
        end: "_1end",
        date: "auj",
        score: "3,14"
      });
      toto = "ff";
      this.dataList.push({
        id:2,
        id_phone: "id2",
        start: "_2start",
        end: "_2end",
        date: "auj",
        score: "42"
      });
      this.dataList.push({
        id:3,
        id_phone: "id1",
        start: "_3start",
        end: "_3end",
        date: "auj",
        score: "0302"
      });
    }

    initialize_Id(){
      if (this.idphone != "") {
        this.checkdatasession(this.idphone);
      } else {
        this.sqlite.create({
          name: 'data.db',
          location: 'default'
        })
        .then((db: SQLiteObject) => {

          db.executeSql('CREATE TABLE IF NOT EXISTS phone(id INTEGER PRIMARY KEY AUTOINCREMENT,uuid)', {})
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));

          this.uuid = this.device.uuid;
          db.executeSql('select * from phone where uuid = ?', [this.uuid]).then((data) => {
            if(data.rows.length > 0) {
              let profile = data.rows.item(0).id;
              this.idphone = data.rows.item(0).id;

              var val = JSON.parse(profile);
              return val;
            }
            else{
              this.adduuid();
            }
          }, (err) => {
            console.log('Unable to execute sql: '+JSON.stringify(err));
          }).then((data) => {
            this.checkdatasession(data);
          });

        })
        .catch(e => console.log(JSON.stringify(e)));
      }
    }

    checkdatasession(idp){
      if (idp != "") {
        this.sqlite.create({
          name: 'data.db',
          location: 'default'
        })
        .then((db: SQLiteObject) => {
          db.executeSql('CREATE TABLE IF NOT EXISTS session(id INTEGER PRIMARY KEY AUTOINCREMENT,id_phone,score,start,end,date,globalGPS)', {})
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));


          db.executeSql('select * from session where id_phone = ? AND end !="" ', [idp]).then((data) => {
            console.log(JSON.stringify(data));
            if(data.rows.length > 0) {
              this.dataList = [];
              for(var i = 0; i < data.rows.length; i++) {
                this.dataList.push({
                  id:data.rows.item(i).id,
                  id_phone: data.rows.item(i).id_phone,
                  start: data.rows.item(i).start,
                  end: data.rows.item(i).end,
                  date: data.rows.item(i).date,
                  score: data.rows.item(i).score
                });
              }
            }
          }).catch(e => console.log(e));
        })
        .catch(e => console.log(JSON.stringify(e)));
      } else {

      }
    }

    adduuid(){
      this.uuid = this.device.uuid;
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS phone(id INTEGER PRIMARY KEY AUTOINCREMENT,uuid)', {})
        .then(() => console.log('Executed SQL'))
        .catch(e => console.log(e));

        db.executeSql('INSERT INTO phone(uuid) VALUES(?)', [this.uuid])
        .then(() => console.log('Executed SQL'))
        .catch(e => console.log(e));

        db.executeSql('select * from phone where uuid = ?', [this.uuid]).then((data) => {
          if(data.rows.length > 0) {
            this.idphone = data.rows.item(0).id;
          }
        });
      }).catch(e => console.log(JSON.stringify(e)));
    }
  }
