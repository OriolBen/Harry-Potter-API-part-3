import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ApiService } from '../../services/api.service'
import { DataService } from '../../services/data.service'
import { AuthenticationService } from '../../services/authentication.service'

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})

export class CharacterComponent implements OnInit {
  character : object
  local : Array<string>
  online : Array<string>
  id : string
  exists : boolean
  link : string

  constructor(private api : ApiService, private storage : DataService, private route : ActivatedRoute, private authService : AuthenticationService) {}

  ngOnInit() {
    this.route.params.subscribe(res => this.id = res.id)
    this.local = this.storage.getCharactersLocal()
    this.getCharacter()
    setTimeout(() => {
      if (this.authService.isLoggedIn()) {
        this.storage.getCharactersOnline().subscribe((characters) => {
          this.online = Object.values(characters[0])
        })
      }
    }, 2500)
  }

  getCharacter() : void {
    this.api.getCharacter(this.id).subscribe((data : object) => {
      if (data.hasOwnProperty('message')) this.exists = false
      else {
        this.character = data
        this.exists = true
        if (typeof this.character["house"] !== 'undefined') this.house()
      }
    })
  }

  check(value : string) : boolean {
    return typeof value !== 'undefined'
  }

  addCharacterLocal() : void {
    this.local = this.storage.addFavouriteLocal("characters", this.id).characters
  }

  addCharacterOnline() : void {
    this.storage.addFavouriteOnline("characters", this.id)
  }

  removeCharacterLocal() : void {
    this.local = this.storage.removeFavouriteLocal("characters", this.id).characters
  }

  removeCharacterOnline() : void {
    this.storage.removeFavouriteOnline("characters", this.id)
  }

  checkCharacterLocal() : boolean {
    for (var i = 0; i < this.local.length; i++) {
      if (this.local[i] == this.id) return true
    }
    return false
  }

  checkCharacterOnline() : boolean {
    for (var i = 0; i < this.online.length; i++) {
      if (this.online[i] == this.id) return true
    }
    return false
  }

  house() : void {
    this.api.getAllHouses().subscribe((data : Array<any>) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].name == this.character["house"]) this.link = data[i]._id
      }
    })
  }
}