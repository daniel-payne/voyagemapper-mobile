import { Component }    from '@angular/core' 
import { Platform }     from 'ionic-angular' 
import { StatusBar }    from '@ionic-native/status-bar' 
import { SplashScreen } from '@ionic-native/splash-screen' 


//import { HomePage }     from '../pages/home/home' 
//import { LoginPage }    from '../pages/login/login' 
import { DataPage }        from '../pages/data/data' 

import { DataManager }     from '../data/DataManager'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any 

  constructor(
    private  platform:     Platform, 
    private  statusBar:    StatusBar, 
    private  splashScreen: SplashScreen, 
    private  dataManager:  DataManager
  ) {
    platform.ready()
      .then(() => {

        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.styleDefault();
        splashScreen.hide();

      }).then(() => { 

        // dataManager.startup().then( () => {

        //   if (dataManager.authorization.isFirstTime === true) {
        //     this.rootPage = LoginPage
        //   } else {
        //     this.rootPage = HomePage  
        //   } 
          
        // })

        this.rootPage = DataPage

      })
   
  }

    
}

 