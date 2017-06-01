import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { Dateformat } from '../../providers/dateformat';
import { LocationTracker } from '../../providers/location-tracker';

import { Vibration } from '@ionic-native/vibration';

@IonicPage()
@Component({
  selector: 'page-apex-modal',
  templateUrl: 'apex-modal.html',
})
export class ApexModal {

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl:ViewController,
    private locationTracker:LocationTracker, private sqlite:SQLite, private dateFormat:Dateformat,
    public loadingCtrl: LoadingController, private alertCtrl: AlertController,
    private vibration: Vibration) {

    }

    //VARIABLES
    remplir;
    idsession = "";
    id_phone: string = this.navParams.get('idphone');
    score;
    p_array;
    r_array;
    c_array;
    points = "";
    loading;
    countLoading:number = 0;

    temp;

    //FUNCTION INITIALIZE
    ionViewDidLoad(){
      console.log("load modal");
      this.waitGPS();
      this.waitRecursif();
      this.locationTracker.startTracking();
      this.initializeVar();
    }
    ionViewWillEnter(){
      console.log("Will Enter modal");
      //this.initializeVar();
    }
    ionViewDidEnter() {
      console.log("Did Enter modal");
      this.startsession();
    }

    ionViewWillLeave(){
      this.stopsesion();
    }

    waitRecursif(){
      this.countLoading++;
      console.log("wait R");
      setTimeout(() => {
        if (this.locationTracker.getLatitude() == 0) {
          if(this.countLoading <= 8){
            this.waitRecursif();
          }
          else{
            let alert = this.alertCtrl.create({
              title: 'GPS not found',
              subTitle: 'Try again, thank !',
              buttons: ['Ok']
            });
            alert.present();
            this.loading.dismiss();
            this.viewCtrl.dismiss();
          }
        } else {
          this.remplir="";
          this.loading.dismiss();
        }
      }, 1000);
    }

    waitGPS(){
      this.loading = this.loadingCtrl.create({
        content: 'Please wait GPS...'
      });
      this.loading.present();
    }

    gps(){
      this.locationTracker.startTracking();
    }

    //FUNCTION
    initializeVar(){
      this.id_phone= this.navParams.get('idphone');
      this.p_array = 0;
      this.r_array = 0;
      this.c_array = 0;
      this.idsession = "";
      this.points = "";
      this.temp = this.id_phone;
    }

    stopsesion(){
      if (this.p_array==0 && this.r_array==0 && this.c_array==0) {
        this.deleteSession(this.idsession);
        this.initializeVar();
        this.locationTracker.stopTracking();
        this.viewCtrl.dismiss();
      } else {
        let score =  this.computeScore();
        this.updateSession(this.idsession, score);
        this.initializeVar();
        this.locationTracker.stopTracking();
        this.viewCtrl.dismiss();
      }
    }

    computeScore():any{
      let totalentity = this.p_array + this.r_array + this.c_array;
      let p_purcent = (this.p_array * 100 / totalentity)/100;
      let r_purcent = (this.r_array * 100 / totalentity)/100;
      let c_purcent = (this.c_array * 100 / totalentity)/100;
      return (100/3)*((1-p_purcent)+(r_purcent)+(2*c_purcent));
    }

    deleteSession(id){
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        let ids = id;

        db.executeSql('CREATE TABLE IF NOT EXISTS session(id INTEGER PRIMARY KEY AUTOINCREMENT,id_phone,score,start,end,date,globalGPS,serve)', {})
        .then(() => console.log('Executed SQL'))
        .catch(e => console.log(e));

        db.executeSql('DELETE * from session WHERE id = ?', [ids])
        .then(() => console.log('Executed SQL'))
        .catch(e => console.log(e));
        return true;
      })
      .catch(e => console.log(JSON.stringify(e)));
    }

    updateSession(id, score):any{
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        let ids = id;
        let end = this.dateFormat.gettime();
        this.remplir = "Update : " + score;

        db.executeSql('CREATE TABLE IF NOT EXISTS session(id INTEGER PRIMARY KEY AUTOINCREMENT,id_phone,score,start,end,date,globalGPS,serve)', {})
        .then(() => console.log('Executed SQL'))
        .catch(e => console.log(e));

        db.executeSql('UPDATE session SET end = ?, score = ? WHERE id = ?', [end,score,ids])
        .then(() => console.log('Executed SQL'))
        .catch(e => console.log(e));
        return true;
      })
      .catch(e => console.log(JSON.stringify(e)));
    }

    startsession(){
      if (this.id_phone == "") {
        // this.remplir = "Wait ..." + this.locationTracker.getLatitude().toFixed(4) + " " + this.locationTracker.getLongitude();
        this.remplir = "Wait ...";
      } else {
        this.p_array = 0;
        this.r_array = 0;
        this.c_array = 0;
        this.sqlite.create({
          name: 'data.db',
          location: 'default'
        })
        .then((db: SQLiteObject) => {
          db.executeSql('CREATE TABLE IF NOT EXISTS session(id INTEGER PRIMARY KEY AUTOINCREMENT,id_phone,score,start,end,date,globalGPS,serve)', {})
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));

          let start = this.dateFormat.gettime();
          let end = "";
          let score = "";
          let date = this.dateFormat.getdate();
          let globalGPS = "";

          db.executeSql('INSERT INTO session(id_phone,score,start,end,date,globalGPS,serve) VALUES(?,?,?,?,?,?,?)', [this.id_phone,score,start,end,date,globalGPS,-1])
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));

          db.executeSql('SELECT * FROM session ORDER BY id DESC LIMIT 1', {}).then((data) => {
            console.log(JSON.stringify(data));
            if(data.rows.length > 0) {
              this.idsession = data.rows.item(0).id;
              // this.remplir = "Start " + this.idsession;
            }
          }).catch(e => console.log(e));
        })
        .catch(e => console.log(JSON.stringify(e)));
      }
    }

    addvalue(apexvalue){
      if (this.idsession != "") {
        if (apexvalue == "P") {
          this.p_array++;
        } else {
          if (apexvalue == "R") {
            this.r_array++;
          } else {
            this.c_array++;
          }
        }
        var tt = this.p_array + this.r_array + this.c_array;
        this.points = "("+tt+")";
        this.sqlite.create({
          name: 'data.db',
          location: 'default'
        })
        .then((db: SQLiteObject) => {
          db.executeSql('CREATE TABLE IF NOT EXISTS datasession(id INTEGER PRIMARY KEY AUTOINCREMENT,id_session,apex,latitude,longitude,hour,serve)', {})
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));
          var id_session = this.idsession;
          var apex = apexvalue;
          var latitude = this.locationTracker.getLatitude();
          var longitude = this.locationTracker.getLongitude();
          var hour = this.dateFormat.gettime();
          this.remplir = "Apex(" + apexvalue + ") - Coord ("+latitude.toFixed(4)+"/"+longitude.toFixed(4)+") ";
          setTimeout(() => {
            this.remplir = "";
          }, 1000);

          db.executeSql('INSERT INTO datasession(id_session,apex,latitude,longitude,hour,serve) VALUES(?,?,?,?,?,?)', [id_session,apex,latitude,longitude,hour,-1])
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));
          this.vibration.vibrate(100);
        })
        .catch(e => console.log(JSON.stringify(e)));
      } else {
        this.startsession();
      }
    }

  }
