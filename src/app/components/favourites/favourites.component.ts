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
  uploading : boolean = false
  ready : boolean = false
  localHouse : object = {}
  localHouseCharacters : object = {}
  localCharacters : Array<any> = []
  localCharactersHouses : object = {}
  localSpells : Array<any> = []
  local : Favourite = {
    house: "",
    characters: [],
    spells: []
  }
  localEmpty : boolean = true
  localEmptyHouse : boolean = true
  localEmptyCharacters : boolean = true
  localEmptySpells : boolean = true
  onlineHouse : object = {}
  onlineHouseCharacters : object = {}
  onlineCharacters : Array<any> = []
  onlineCharactersHouses : object = {}
  onlineSpells : Array<any> = []
  online : Favourite = {
    house: "",
    characters: [],
    spells: []
  }
  onlineEmpty : boolean = true
  onlineEmptyHouse : boolean = true
  onlineEmptyCharacters : boolean = true
  onlineEmptySpells : boolean = true

  constructor(private api : ApiService, private storage : DataService, private authService : AuthenticationService) {}

  ngOnInit() {
    this.local = this.storage.getFavouriteLocal()
    this.localEmptyHouse = this.local.house == "" ? true : false
    if (!this.localEmptyHouse) {
      this.getHouseLocal()
      this.getCharactersNamesLocal()
    }
    this.localEmptyCharacters = this.local.characters.length == 0 ? true : false
    if (!this.localEmptyCharacters) {
      this.getHousesIdLocal()
      this.getCharactersLocal()
    }
    this.localEmptySpells = this.local.spells.length == 0 ? true : false
    if (!this.localEmptySpells) this.getSpellsLocal()
    this.localEmpty = this.localEmptyHouse && this.localEmptyCharacters && this.localEmptySpells ? true : false
    setTimeout(() => {
      if (this.authService.isLoggedIn()) {
        this.storage.getFavouriteOnline().subscribe((data) => {
          this.online.characters = Object.values(data[0])
          this.online.house = data[1]
          this.online.spells = Object.values(data[2])
          this.onlineEmptyHouse = this.online.house == "" ? true : false
          if (!this.onlineEmptyHouse) {
            this.getHouseOnline()
            this.getCharactersNamesOnline()
          }
          this.onlineEmptyCharacters = this.online.characters.length == 0 ? true : false
          if (!this.onlineEmptyCharacters) {
            this.getHousesIdOnline()
            this.getCharactersOnline()
          }
          this.onlineEmptySpells = this.online.spells.length == 0 ? true : false
          if (!this.onlineEmptySpells) this.getSpellsOnline()
          this.onlineEmpty = this.onlineEmptyHouse && this.onlineEmptyCharacters && this.onlineEmptySpells ? true : false
          this.ready = true
        })
      }
    }, 2500)
  }

  getHouseLocal() : void {
    this.api.getHouse(this.local.house).subscribe((data : object) => {
      this.localHouse = data[0]
    })
  }

  getHouseOnline() : void {
    this.api.getHouse(this.online.house).subscribe((data : object) => {
      this.onlineHouse = data[0]
    })
  }

  getCharactersNamesLocal() : void {
    this.api.getAllCharacters().subscribe((data : Array<any>) => {
      data.forEach((character) => {
        if (character.house == this.localHouse["name"]) this.localHouseCharacters[character._id] = character.name
      })
    })
  }

  getCharactersNamesOnline() : void {
    this.api.getAllCharacters().subscribe((data : Array<any>) => {
      data.forEach((character) => {
        if (character.house == this.onlineHouse["name"]) this.onlineHouseCharacters[character._id] = character.name
      })
    })
  }

  removeHouseLocal(id : string) : void {
    this.local.house = this.storage.removeFavouriteLocal("house", id).house
    this.localHouse = {}
    this.localHouseCharacters = {}
    this.localEmptyHouse = this.local.house == "" ? true : false
    this.localEmpty = this.localEmptyHouse && this.localEmptyCharacters && this.localEmptySpells ? true : false
  }

  removeHouseOnline(id : string) : void {
    this.storage.removeFavouriteOnline("house", id)
  }

  checkHouseCharactersLocal(id : string) : boolean {
    return id in this.localHouseCharacters
  }

  checkHouseCharactersOnline(id : string) : boolean {
    return id in this.onlineHouseCharacters
  }

  getHousesIdLocal() : void {
    this.api.getAllHouses().subscribe((data : Array<any>) => {
      data.forEach((house) => {
        this.localCharactersHouses[house.name] = house._id
      })
    })
  }

  getHousesIdOnline() : void {
    this.api.getAllHouses().subscribe((data : Array<any>) => {
      data.forEach((house) => {
        this.onlineCharactersHouses[house.name] = house._id
      })
    })
  }

  getCharactersLocal() : void {
    this.local.characters.forEach((id) => {
      this.api.getCharacter(id).subscribe((data : object) => {
        this.localCharacters.push(data)
      })
    })
  }

  getCharactersOnline() : void {
    this.onlineCharacters = []
    this.online.characters.forEach((id) => {
      this.api.getCharacter(id).subscribe((data : object) => {
        this.onlineCharacters.push(data)
      })
    })
  }

  checkCharacterInfo(value : string) : boolean {
    return typeof value !== 'undefined'
  }

  characterHouseLocal(house : string) : string {
    return this.localCharactersHouses[house]
  }

  characterHouseOnline(house : string) : string {
    return this.onlineCharactersHouses[house]
  }

  removeCharacterLocal(id : string) : void {
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

  removeCharacterOnline(id : string) : void {
    this.storage.removeFavouriteOnline("characters", id)
  }

  getSpellsLocal() : void {
    this.api.getAllSpells().subscribe((data : Array<any>) => {
      data.forEach((spell) => {
        if (this.local.spells.includes(spell._id)) this.localSpells.push(spell)
      })
    })
  }

  getSpellsOnline() : void {
    this.onlineSpells = []
    this.api.getAllSpells().subscribe((data : Array<any>) => {
      data.forEach((spell) => {
        if (this.online.spells.includes(spell._id)) this.onlineSpells.push(spell)
      })
    })
  }

  removeSpellLocal(id : string) : void {
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

  removeSpellOnline(id : string) : void {
    this.storage.removeFavouriteOnline("spells", id)
  }

  upload() {
    this.uploading = true
    this.uploading = false
  }
}