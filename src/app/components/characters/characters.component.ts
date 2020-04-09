import { Component, OnInit } from '@angular/core'
import { ApiService } from '../../services/api.service'
import { DataService } from '../../services/data.service'
import { AuthenticationService } from '../../services/authentication.service'

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})

export class CharactersComponent implements OnInit {
  characters : Array<any> = []
  houses : object = {}
  local : Array<string> = []
  online : Array<string> = []
  name : string = ""
  temporaryName : string = ""
  filtered : Array<any> = []
  filter : string = "none"
  filters : object = {}
  temporaryFilters : object = {
    "house": "Ignore",
    "bloodStatus": "Ignore",
    "deathEater": "Ignore",
    "dumbledoresArmy": "Ignore",
    "orderOfThePhoenix": "Ignore",
    "ministryOfMagic": "Ignore"
  }

  constructor(private api : ApiService, private storage : DataService, private authService : AuthenticationService) {}

  ngOnInit() {
    this.local = this.storage.getCharactersLocal()
    this.getHousesId()
    this.getAllCharacters()
    setTimeout(() => {
      if (this.authService.isLoggedIn()) {
        this.storage.getCharactersOnline().subscribe((characters) => {
          this.online = Object.values(characters[0])
        })
      }
    }, 2500)
  }

  getHousesId() : void {
    this.api.getAllHouses().subscribe((data : Array<any>) => {
      data.forEach((house) => {
        this.houses[house.name] = house._id
      })
    })
  }

  getAllCharacters() : void {
    this.api.getAllCharacters().subscribe((data : Array<any>) => {
      this.characters = data
      this.filtered = data
    })
  }

  check(value : string) : boolean {
    return typeof value !== 'undefined'
  }

  house(house : string) : string {
    return this.houses[house]
  }

  updateFilter(category : string) : void {
    this.filter = category
    switch (this.filter) {
      case "name":
        this.name = this.temporaryName
        break
      case "custom":
        this.filters = this.temporaryFilters
        break
    }
  }

  applyFilter() : Array<any> {
    switch (this.filter) {
      case "none": 
        this.filtered = this.characters
        break
      case "name":
        this.filtered = this.characters.filter((character) => character.name.toLowerCase().includes(this.name.toLowerCase()))
        break
      case "custom":
        this.filter = "ignore"
        this.filtered = this.characters.filter((character) => {
          let stop = false
          for (let index in this.filters) {
            if (this.filters[index] != "Ignore") {
              if (this.check(character[index])) {
                if (character[index].toString() != this.filters[index]) stop = true
              }
              else stop = true
              if (stop) break
            }
          }
          return !stop
        })
        break
    }
    return this.filtered
  }

  customSearch() : void {
    this.api.getAllCharacters().subscribe((data : Array<any>) => {
      this.characters = []
      
    })
  }

  addCharacterLocal(id : string) : void {
    this.local = this.storage.addFavouriteLocal("characters", id).characters
  }

  addCharacterOnline(id : string) : void {
    this.storage.addFavouriteOnline("characters", id)
  }

  removeCharacterLocal(id : string) : void {
    this.local = this.storage.removeFavouriteLocal("characters", id).characters
  }

  removeCharacterOnline(id : string) : void {
    this.storage.removeFavouriteOnline("characters", id)
  }

  checkCharacterLocal(id : string) : boolean {
    for (var i = 0; i < this.local.length; i++) {
      if (this.local[i] == id) return true
    }
    return false
  }

  checkCharacterOnline(id : string) : boolean {
    for (var i = 0; i < this.online.length; i++) {
      if (this.online[i] == id) return true
    }
    return false
  }
}