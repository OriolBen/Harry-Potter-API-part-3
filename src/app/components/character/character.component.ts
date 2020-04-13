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
  character : object = {}
  id : string = ""
  exists : boolean = false
  link : string = ""

  constructor(private api : ApiService, private storage : DataService, private route : ActivatedRoute, private authService : AuthenticationService) {}

  ngOnInit() {
    this.route.params.subscribe(res => this.id = res.id)
    this.getCharacter()
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
    this.storage.addFavouriteLocal("characters", this.id)
  }

  addCharacterOnline() : void {
    this.storage.addFavouriteOnline("characters", this.id)
  }

  removeCharacterLocal() : void {
    this.storage.removeFavouriteLocal("characters", this.id)
  }

  removeCharacterOnline() : void {
    this.storage.removeFavouriteOnline("characters", this.id)
  }

  checkCharacterLocal() : boolean {
    for (var i = 0; i < this.storage.local.characters.length; i++) {
      if (this.storage.local.characters[i] == this.id) return true
    }
    return false
  }

  checkCharacterOnline() : boolean {
    for (var i = 0; i < this.storage.online.characters.length; i++) {
      if (this.storage.online.characters[i] == this.id) return true
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