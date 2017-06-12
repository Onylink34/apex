import { Component } from '@angular/core';
import { NavController, Platform, ModalController,LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Device } from '@ionic-native/device';
import { Http} from '@angular/http';

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
  idserve="";
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
    private modalCtrl: ModalController,
    private http: Http) {

    }

    ionViewDidLoad(){
      // this.initialize_Id();
      //this.preremplissagelist();
    }

    ionViewWillEnter(){
      this.initialize_Id();
    }

    ionViewDidEnter(){
      // this.initialize_Id();
      this.locationTracker.startTracking();
      this.uuid = this.device.uuid;
      this.servestatus();
    }

    preremplissagelist(){
      this.dataList.push({
        id:1,
        id_phone: 12222,
        start: "start",
        end: "end",
        date: "date",
        score: "score"
      });
      this.dataList.push({
        id:2,
        id_phone: 12222,
        start: "start 2",
        end: "end 2",
        date: "date 2",
        score: "score 2"
      });
    }
    startSession(){
      let obj = {idphone: this.idphone};
      let myModal = this.modalCtrl.create(ApexModal, obj);
      myModal.onDidDismiss(() => {
        this.initialize_Id();
      });
      myModal.present();
    }

    viewdata(e){
      let obj = {idphone: this.idphone, idsession: e.id, score:e.score};
      let myModal = this.modalCtrl.create(DataSessionModal, obj);
      myModal.present();
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
          db.executeSql('CREATE TABLE IF NOT EXISTS phone(id INTEGER PRIMARY KEY AUTOINCREMENT,uuid,serve)', {})
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));

          this.uuid = this.device.uuid;
          db.executeSql('select * from phone where uuid = ?', [this.uuid]).then((data) => {
            if(data.rows.length > 0) {
              let profile = data.rows.item(0).id;
              this.idphone = data.rows.item(0).id;
              this.idserve = data.rows.item(0).serve;
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
          db.executeSql('CREATE TABLE IF NOT EXISTS session(id INTEGER PRIMARY KEY AUTOINCREMENT,id_phone,score,start,end,date,globalGPS,serve)', {})
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));

          db.executeSql('select * from session where id_phone = ? AND end !="" ORDER BY id DESC', [idp]).then((data) => {
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
                  score: data.rows.item(i).score.toFixed(2),
                  index_var:i
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
        db.executeSql('CREATE TABLE IF NOT EXISTS phone(id INTEGER PRIMARY KEY AUTOINCREMENT,uuid,serve)', {})
        .then(() => console.log('Executed SQL'))
        .catch(e => console.log(e));

        //-21 == numéro temporaire avant l'id du serve
        db.executeSql('INSERT INTO phone(uuid,serve) VALUES(?,?)', [this.uuid,-1])
        .then(() => console.log('Executed SQL'))
        .catch(e => console.log(e));

        db.executeSql('select * from phone where uuid = ?', [this.uuid]).then((data) => {
          if(data.rows.length > 0) {
            this.idphone = data.rows.item(0).id;
          }
        });
      }).catch(e => console.log(JSON.stringify(e)));
    }

    servestatus(){
      var str = "test serve";
      var response;

      // if (this.idphone != "") {
      //   if()
      // } else {
      //   this.initialize_Id();
      // }

      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS session(id INTEGER PRIMARY KEY AUTOINCREMENT,id_phone,score,start,end,date,globalGPS,serve)', {})
        .then(() => console.log('Executed SQL'))
        .catch(e => console.log(e));

        db.executeSql('select * from session where not serve = -1', {}).then((data) => {
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
                score: data.rows.item(i).score.toFixed(2),
                index_var:i
              });

              var link = 'http://gbrunel.fr/ionic/api4.php';
              var datatosend = JSON.stringify(this.dataList);
                this.http.post(link, datatosend)
                .subscribe(data2 => {
                  response = data2.text();
                  this.zen = response;
                }, error => {
                    console.log("Oooops!");
                });

            }
          }
        }).catch(e => console.log(e));
      })
      .catch(e => console.log(JSON.stringify(e)));



      setTimeout(() => {
        //TOdo serve
        var link = 'http://gbrunel.fr/ionic/api4.php';
          var data = JSON.stringify({username: str});
          this.http.post(link, data)
          .subscribe(data => {
            response = data.text();
            this.zen = response;
          }, error => {
              console.log("Oooops!");
          });
        this.servestatus();
        },4000);
    }



  }
