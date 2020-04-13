import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ApiService } from '../../services/api.service'
import { DataService } from '../../services/data.service'
import { AuthenticationService } from '../../services/authentication.service'

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.css']
})

export class HouseComponent implements OnInit {
  house : object = {}
  id : string = ""
  exists : boolean = false
  characters : object = {}

  constructor(private api : ApiService, private storage : DataService, private route : ActivatedRoute, private authService : AuthenticationService) {}

  ngOnInit() {
    this.route.params.subscribe(res => this.id = res.id)
    this.getHouse()
  }

  getHouse() : void {
    this.api.getHouse(this.id).subscribe((data : object) => {
      if (data.hasOwnProperty('message')) this.exists = false
      else {
        this.house = data[0]
        this.exists = true
        this.getCharactersNames()
      }
    }) 
  }

  getCharactersNames() : void {
    this.api.getAllCharacters().subscribe((data : Array<any>) => {
      data.forEach((character) => {
        if (character.house == this.house["name"]) this.characters[character._id] = character.name
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