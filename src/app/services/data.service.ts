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
  local : Favourite
  online : Favourite

  constructor(@Inject(LOCAL_DATA) public data : Storage, private db : AngularFireDatabase, public authentication : AuthenticationService) {
    let exists = this.data.getItem('Harry Potter API')
    if (!exists) {
      this.local = {
        "house": "",
        "characters": [],
        "spells": []
      }
    }
    else this.local = JSON.parse(exists)
  }

  getFavouriteLocal() : Favourite {
    return this.local
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

  getCharactersLocal() : Array<string> {
    return this.local.characters
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
}