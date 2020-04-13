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
  onlineHouse : object = {}
  onlineHouseCharacters : object = {}
  onlineCharacters : Array<any> = []
  onlineCharactersHouses : object = {}
  onlineSpells : Array<any> = []

  onlineEmpty : boolean = true
  onlineEmptyHouse : boolean = true
  onlineEmptyCharacters : boolean = true
  onlineEmptySpells : boolean = true

  constructor(private api : ApiService, private storage : DataService, private authService : AuthenticationService) {}

  ngOnInit() {
    this.storage.localEmptyHouse = this.storage.local.house == "" ? true : false
    if (!this.storage.localEmptyHouse) {
      this.getHouseLocal()
      this.getCharactersNamesLocal()
    }
    this.storage.localEmptyCharacters = this.storage.local.characters.length == 0 ? true : false
    if (!this.storage.localEmptyCharacters) {
      this.getHousesIdLocal()
      this.getCharactersLocal()
    }
    this.storage.localEmptySpells = this.storage.local.spells.length == 0 ? true : false
    if (!this.storage.localEmptySpells) this.getSpellsLocal()
    this.storage.localEmpty = this.storage.localEmptyHouse && this.storage.localEmptyCharacters && this.storage.localEmptySpells ? true : false

    this.onlineEmptyHouse = this.storage.online.house == "" ? true : false
    if (!this.onlineEmptyHouse) {
      this.getHouseOnline()
      this.getCharactersNamesOnline()
    }
    this.onlineEmptyCharacters = this.storage.online.characters.length == 0 ? true : false
    if (!this.onlineEmptyCharacters) {
      this.getHousesIdOnline()
      this.getCharactersOnline()
    }
    this.onlineEmptySpells = this.storage.online.spells.length == 0 ? true : false
    if (!this.onlineEmptySpells) this.getSpellsOnline()
    this.onlineEmpty = this.onlineEmptyHouse && this.onlineEmptyCharacters && this.onlineEmptySpells ? true : false
    setInterval (() => {
      console.log(this.storage.online.house)
      console.log(this.onlineEmptyHouse)
    }, 3000)
  }

  getHouseLocal() : void {
    this.api.getHouse(this.storage.local.house).subscribe((data : object) => {
      this.localHouse = data[0]
    })
  }

  getHouseOnline() : void {
    this.api.getHouse(this.storage.online.house).subscribe((data : object) => {
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
    this.storage.removeFavouriteLocal("house", id)
    this.localHouse = {}
    this.localHouseCharacters = {}
    this.storage.localEmptyHouse = this.storage.local.house == "" ? true : false
    this.storage.localEmpty = this.storage.localEmptyHouse && this.storage.localEmptyCharacters && this.storage.localEmptySpells ? true : false
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
    this.storage.local.characters.forEach((id) => {
      this.api.getCharacter(id).subscribe((data : object) => {
        this.localCharacters.push(data)
      })
    })
  }

  getCharactersOnline() : void {
    this.onlineCharacters = []
    this.storage.online.characters.forEach((id) => {
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
    this.storage.removeFavouriteLocal("characters", id)
    this.storage.localEmptyCharacters = this.storage.local.characters.length == 0 ? true : false
    this.storage.localEmpty = this.storage.localEmptyHouse && this.storage.localEmptyCharacters && this.storage.localEmptySpells ? true : false
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
        if (this.storage.local.spells.includes(spell._id)) this.localSpells.push(spell)
      })
    })
  }

  getSpellsOnline() : void {
    this.onlineSpells = []
    this.api.getAllSpells().subscribe((data : Array<any>) => {
      data.forEach((spell) => {
        if (this.storage.online.spells.includes(spell._id)) this.onlineSpells.push(spell)
      })
    })
  }

  removeSpellLocal(id : string) : void {
    this.storage.removeFavouriteLocal("spells", id)
    this.storage.localEmptySpells = this.storage.local.spells.length == 0 ? true : false
    this.storage.localEmpty = this.storage.localEmptyHouse && this.storage.localEmptyCharacters && this.storage.localEmptySpells ? true : false
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
}