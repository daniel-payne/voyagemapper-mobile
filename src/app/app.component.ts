import { Component }    from '@angular/core' 
import { Platform }     from 'ionic-angular' 
import { StatusBar }    from '@ionic-native/status-bar' 
import { SplashScreen } from '@ionic-native/splash-screen' 

// import { HomePage }     from '../pages/home/home' 
// import { LoginPage }    from '../pages/login/login' 

import { DataPage }    from '../pages/data/data' 

import { StoreManager }     from '../data/StoreManager'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any 

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private storeManager: StoreManager) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.rootPage = DataPage 

    // storeManager.loadCache().then(session => {

    //   this.storeManager.loadCurrentPosition()

    //   if (session){
    //     this.rootPage = HomePage 
    //   } else {
    //     this.rootPage = LoginPage 
    //   }
    // }) 
  }

    
}

 