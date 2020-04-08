import { Component, OnInit } from '@angular/core'
import { ApiService } from '../../services/api.service'
import { Favourite, DataService } from '../../services/data.service'
import { AuthenticationService } from '../../services/authentication.service'

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})

export class FavouritesComponent implements OnInit {
  mode : string = "local"
  localHouse : object = {}
  localHouseCharacters : object = {}
  localCharacters : Array<any> = []
  localCharactersHouses : object = {}
  localSpells : Array<any> = []
  local : Favourite
  localEmpty : boolean
  localEmptyHouse : boolean
  localEmptyCharacters : boolean
  localEmptySpells : boolean

  constructor(private api : ApiService, private storage : DataService, private authService : AuthenticationService) {}

  ngOnInit() {
    if (this.authService.isLoggedIn())
    this.local = this.storage.getFavouriteLocal()
    this.localEmptyHouse = this.local.house == "" ? true : false
    if (!this.localEmptyHouse) {
      this.getHouse()
      this.getCharactersNames()
    }
    this.localEmptyCharacters = this.local.characters.length == 0 ? true : false
    if (!this.localEmptyCharacters) {
      this.getHousesId()
      this.getCharacters()
    }
    this.localEmptySpells = this.local.spells.length == 0 ? true : false
    if (!this.localEmptySpells) this.getSpells()
    this.localEmpty = this.localEmptyHouse && this.localEmptyCharacters && this.localEmptySpells ? true : false
  }

  getHouse() : void {
    this.api.getHouse(this.local.house).subscribe((data : object) => {
      this.localHouse = data[0]
    })
  }

  getCharactersNames() : void {
    this.api.getAllCharacters().subscribe((data : Array<any>) => {
      data.forEach((character) => {
        if (character.house == this.localHouse["name"]) this.localHouseCharacters[character._id] = character.name
      })
    })
  }

  removeHouse(id : string) : void {
    this.local.house = this.storage.removeFavouriteLocal("house", id).house
    this.localHouse = {}
    this.localHouseCharacters = {}
    this.localEmptyHouse = this.local.house == "" ? true : false
    this.localEmpty = this.localEmptyHouse && this.localEmptyCharacters && this.localEmptySpells ? true : false
  }

  checkHouseCharacters(id : string) : boolean {
    return id in this.localHouseCharacters
  }

  getHousesId() : void {
    this.api.getAllHouses().subscribe((data : Array<any>) => {
      data.forEach((house) => {
        this.localCharactersHouses[house.name] = house._id
      })
    })
  }

  getCharacters() : void {
    this.local.characters.forEach((id) => {
      this.api.getCharacter(id).subscribe((data : object) => {
        this.localCharacters.push(data)
      })
    })
  }

  checkCharacterInfo(value : string) : boolean {
    return typeof value !== 'undefined'
  }

  characterHouse(house : string) : string {
    return this.localCharactersHouses[house]
  }

  removeCharacter(id : string) : void {
    this.local.characters = this.storage.removeFavouriteLocal("characters", id).characters
    this.localEmptyCharacters = this.local.characters.length == 0 ? true : false
    this.localEmpty = this.localEmptyHouse && this.localEmptyCharacters && this.localEmptySpells ? true : false
    for (let i = 0, stop = false; i < this.localCharacters.length && !stop; ++i) {
      if (this.localCharacters[i]._id == id) {
        this.localCharacters.splice(i, 1)
        stop = true
      }
    }
  }

  getSpells() : void {
    this.api.getAllSpells().subscribe((data : Array<any>) => {
      data.forEach((spell) => {
        if (this.local.spells.includes(spell._id)) this.localSpells.push(spell)
      })
    })
  }

  removeSpell(id : string) : void {
    this.local.spells = this.storage.removeFavouriteLocal("spells", id).spells
    this.localEmptySpells = this.local.spells.length == 0 ? true : false
    this.localEmpty = this.localEmptyHouse && this.localEmptyCharacters && this.localEmptySpells ? true : false
    for (let i = 0, stop = false; i < this.localSpells.length && !stop; ++i) {
      if (this.localSpells[i]._id == id) {
        this.localSpells.splice(i, 1)
        stop = true
      }
    }
  }
}