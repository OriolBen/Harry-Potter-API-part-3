import { Component, OnInit } from '@angular/core'
import { ApiService } from '../../services/api.service'
import { DataService } from '../../services/data.service'
import { AuthenticationService } from '../../services/authentication.service'

@Component({
  selector: 'app-houses',
  templateUrl: './houses.component.html',
  styleUrls: ['./houses.component.css']
})

export class HousesComponent implements OnInit {
  houses : Array<any> = []
  characters : object = {}

  constructor(private api : ApiService, private storage : DataService, private authService : AuthenticationService) {}

  ngOnInit() {
    this.getCharactersNames()
    this.getAllHouses()
  }

  getAllHouses() : void {
    this.api.getAllHouses().subscribe((data : Array<any>) => {
      this.houses = data
    }) 
  }

  getCharactersNames() : void {
    this.api.getAllCharacters().subscribe((data : Array<any>) => {
      data.forEach((character) => {
        this.characters[character._id] = character.name
      })
    })
  }

  addHouseLocal(id : string) : void {
    this.storage.addFavouriteLocal("house", id)
  }

  addHouseOnline(id : string) : void {
    this.storage.addFavouriteOnline("house", id)
  }

  removeHouseLocal(id : string) : void {
    this.storage.removeFavouriteLocal("house", id)
  }

  removeHouseOnline(id : string) : void {
    this.storage.removeFavouriteOnline("house", id)
  }

  checkHouseLocal(id : string) : boolean {
    return this.storage.local.house == id
  }

  checkHouseOnline(id : string) : boolean {
    return this.storage.online.house == id
  }

  check(id : string) : boolean {
    return id in this.characters
  }
}