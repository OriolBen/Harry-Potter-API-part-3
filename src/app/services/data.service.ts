import { Inject, Injectable, InjectionToken } from '@angular/core'
import { AuthenticationService } from './authentication.service'
import { AngularFireDatabase } from '@angular/fire/database'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export const LOCAL_DATA = new InjectionToken<Storage>('Local Data', {
  providedIn: 'root',
  factory: () => localStorage
})

export interface Favourite {
  house : string,
  characters : Array<string>,
  spells : Array<string>
}

@Injectable({
  providedIn: 'root'
})

export class DataService {
  local : Favourite = {
    "house": "",
    "characters": [],
    "spells": []
  }
  online : Favourite = {
    "house": "",
    "characters": [],
    "spells": []
  }
  uploading : boolean = false

  constructor(@Inject(LOCAL_DATA) public data : Storage, private db : AngularFireDatabase, public authentication : AuthenticationService) {
    let exists = this.data.getItem('Harry Potter API')
    if (exists) this.local = JSON.parse(exists)
    setTimeout(() => {
      if (this.authentication.isLoggedIn()) {
        this.getFavouriteOnline().subscribe((data) => {
          this.online.characters = Object.values(data[0])
          this.online.house = data[1]
          this.online.spells = Object.values(data[2])
        })
      }
    }, 2500)
  }

  getFavouriteLocal() : Favourite {
    return this.local
  }

  getFavouriteOnline() : Observable<any> {
    return this.db.list(this.authentication.userDetails.uid).valueChanges()
  }

  getHouseLocal() : string {
    return this.local.house
  }

  getHouseOnline() : Observable<any> {
    return this.db.list(this.authentication.userDetails.uid, ref => ref.orderByKey().equalTo("house")).valueChanges()
  }
  
  getSpellsLocal() : Array<string> {
    return this.local.spells
  }

  getSpellsOnline() : Observable<any> {
    return this.db.list(this.authentication.userDetails.uid, ref => ref.orderByKey().equalTo("spells")).valueChanges()
  }

  getCharactersLocal() : Array<string> {
    return this.local.characters
  }

  getCharactersOnline() : Observable<any> {
    return this.db.list(this.authentication.userDetails.uid, ref => ref.orderByKey().equalTo("characters")).valueChanges()
  }

  addFavouriteLocal(category : string, id : string) : Favourite {
    switch (category) {
      case "house":
        this.local.house = id
        break
      default:
        this.local[category].push(id)
        break
    }
    this.data.setItem('Harry Potter API', JSON.stringify(this.local))
    return this.local
  }

  addFavouriteOnline(category : string, id : string) : Favourite {
    switch (category) {
      case "house":
        this.db.database.ref(this.authentication.userDetails.uid).update({
          house: id
        }).then(() => this.online.house = id)
        break
      default:
        this.db.database.ref(this.authentication.userDetails.uid + "/" + category).update({
          [id]: id
        }).then(() => this.online[category].push(id))
        break
    }
    return this.online
  }

  removeFavouriteLocal(category : string, id : string) : Favourite {
    switch (category) {
      case "house": 
        this.local.house = ""
        break
      default:
        for (var i = 0; i < this.local[category].length; i++) {
          if (this.local[category][i] == id) this.local[category].splice(i, 1)
        }
        break
    }
    this.data.setItem('Harry Potter API', JSON.stringify(this.local))
    return this.local
  }

  removeFavouriteOnline(category : string, id : string) : Favourite {
    switch (category) {
      case "house": 
        this.db.database.ref(this.authentication.userDetails.uid).update({
          house: ""
        }).then(() => this.online.house = "") 
        break
      default:
        for (var i = 0; i < this.online[category].length; i++) {
          if (this.online[category][i] == id) this.online[category].splice(i, 1)
        }
        if (this.online[category].length != 0) this.db.database.ref(this.authentication.userDetails.uid + "/" + category + "/" + id).remove()
        else this.db.database.ref(this.authentication.userDetails.uid).update({
          [category]: ""
        })
        break
    }
    return this.online
  }

  upload() : void {
    this.uploading = true
    let characters = this.local.characters.reduce(function(o, val) {
      o[val] = val
      return o
    }, {})
    let spells = this.local.spells.reduce(function(o, val) {
      o[val] = val
      return o
    }, {})
    this.db.database.ref(this.authentication.userDetails.uid).set({
      house: this.local.house,
      characters: characters,
      spells: spells,
    }).then(() => this.uploading = false)
  }
}