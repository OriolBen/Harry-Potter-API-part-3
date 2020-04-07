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
  local : string
  online : string
  characters : object = {}

  constructor(private api : ApiService, private storage : DataService, private authService : AuthenticationService) {}

  ngOnInit() {
    this.local = this.storage.getHouseLocal()
    this.getCharactersNames()
    this.getAllHouses()
    setTimeout(() => {
      if (this.authService.isLoggedIn()) this.storage.getHouseOnline().subscribe((house) => this.online = house)
    }, 2500)
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
    this.local = this.storage.addFavouriteLocal("house", id).house
  }

  addHouseOnline(id : string) : void {
    this.online = this.storage.addFavouriteOnline("house", id).house
  }

  removeHouseLocal(id : string) : void {
    this.local = this.storage.removeFavouriteLocal("house", id).house
  }

  removeHouseOnline(id : string) : void {
    this.online = this.storage.removeFavouriteOnline("house", id).house
  }

  checkHouseLocal(id : string) : boolean {
    return this.local == id
  }

  checkHouseOnline(id : string) : boolean {
    return this.online == id
  }

  check(id : string) : boolean {
    return id in this.characters
  }
}