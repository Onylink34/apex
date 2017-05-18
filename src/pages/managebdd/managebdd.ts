import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/**
 * Generated class for the Managebdd page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-managebdd',
  templateUrl: 'managebdd.html',
})
export class Managebdd {
  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Managebdd');
  }

  deletephone(){
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql('DROP TABLE phone', {})
      .then(() => console.log('Executed SQL'))
      .catch(e => console.log(e));
    })
    .catch(e => console.log(JSON.stringify(e)));
  }
  deletesession(){
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql('DROP TABLE session', {})
      .then(() => console.log('Executed SQL'))
      .catch(e => console.log(e));
    })
    .catch(e => console.log(JSON.stringify(e)));
  }
  deletedatasession(){
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql('DROP TABLE datasession', {})
      .then(() => console.log('Executed SQL'))
      .catch(e => console.log(e));
    })
    .catch(e => console.log(JSON.stringify(e)));
  }

cleanphone(){
  this.sqlite.create({
    name: 'data.db',
    location: 'default'
  })
  .then((db: SQLiteObject) => {
    db.executeSql('DELETE from phone', {})
    .then(() => console.log('Executed SQL'))
    .catch(e => console.log(e));
  })
  .catch(e => console.log(JSON.stringify(e)));
}

cleansession(){
  this.sqlite.create({
    name: 'data.db',
    location: 'default'
  })
  .then((db: SQLiteObject) => {
    db.executeSql('DELETE from session', {})
    .then(() => console.log('Executed SQL'))
    .catch(e => console.log(e));
  })
  .catch(e => console.log(JSON.stringify(e)));
}

cleandatasession(){
  this.sqlite.create({
    name: 'data.db',
    location: 'default'
  })
  .then((db: SQLiteObject) => {
    db.executeSql('DELETE from datasession', {})
    .then(() => console.log('Executed SQL'))
    .catch(e => console.log(e));
  })
  .catch(e => console.log(JSON.stringify(e)));
}



}
