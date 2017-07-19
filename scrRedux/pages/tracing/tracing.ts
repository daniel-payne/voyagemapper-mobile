import { Component }                           from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { select }                              from 'ng2-redux';

@IonicPage()
@Component({
  selector: 'page-tracing',
  templateUrl: 'tracing.html',
})
export class TracingPage {

  @select(['geographic', 'currentPosition', 'latitude'          ]) latitude$      
  @select(['geographic', 'currentPosition', 'longitude'         ]) longitude$      
  @select(['geographic', 'currentPosition', 'takenAtUTC'        ]) takenAtUTC$      

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TracingPage');
  }

}
