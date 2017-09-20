import { Component, ElementRef, ViewChild }         from '@angular/core' 
import { NavController, NavParams, ViewController } from 'ionic-angular' 
import { select }                                   from 'ng2-redux' 

// import { DataManager }     from '../../data/DataManager'
import { DataConnector }   from '../../data/connector'
import { Point }           from '../../data/clases/point'

@Component({
  selector:    'page-add-place',
  templateUrl: 'add-place.html', 
})
export class AddPlacePage {

  @ViewChild('searchPlace') searchPlace: ElementRef 

  @select(['search', 'matches' ]) matches$
 
  matches: any = []

  pointType       = undefined
  showTownsOption = false

  constructor(
    private  viewController:    ViewController,     
    // private  dataManager:       DataManager,
    private  dataConnector:     DataConnector,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad add-place') 
  }

  close(){
    this.viewController.dismiss()  
  }

  getCities(searchTerm: any){
    
    if (searchTerm.length > 2){
      this.dataConnector.matchConurbation(searchTerm).then(() => {
        this.showTownsOption = true
      }) 
    } else {
      this.showTownsOption = false
      this.dataConnector.clearMatches()
    }

  }

  getTowns(searchTerm: any){
    
    this.dataConnector.matchSettlement(searchTerm)

    this.showTownsOption = false

  }

  addPlace(match){

    let newPoint = new Point(match)
 
    this.dataConnector.addPoint(newPoint)  

    this.close()

  }
}
