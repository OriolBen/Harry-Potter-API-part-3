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

  addHouse(id : string) : void {
    this.local = this.storage.addFavouriteLocal("house", id).house
  }

  removeHouse(id : string) : void {
    this.local = this.storage.removeFavouriteLocal("house", id).house
  }

  checkHouse(id : string) : boolean {
    return this.local == id
  }

  check(id : string) : boolean {
    return id in this.characters
  }
}