import { Component, OnInit } from '@angular/core'
import { ApiService } from '../../services/api.service'
import { DataService } from '../../services/data.service'
import { AuthenticationService } from '../../services/authentication.service'

@Component({
  selector: 'app-spells',
  templateUrl: './spells.component.html',
  styleUrls: ['./spells.component.css']
})

export class SpellsComponent implements OnInit {
  spells : Array<any> = []
  local : Array<string> = []
  online : Array<string> = []
  temporaryName : string = ""
  name : string = ""
  option : string = ""
  filter : string = "none"
  filtered : Array<any> = []

  constructor(private api : ApiService, private storage : DataService, private authService : AuthenticationService) {}

  ngOnInit() {
    this.local = this.storage.getSpellsLocal()
    this.getAllSpells()
    setTimeout(() => {
      if (this.authService.isLoggedIn()) {
        this.storage.getSpellsOnline().subscribe((spells) => {
          this.online = Object.values(spells[0])
        })
      }
    }, 2500)
  }

  getAllSpells() : void {
    this.api.getAllSpells().subscribe((data : Array<any>) => {
      this.spells = data
      this.filtered = data
    })
  }

  updateFilter(category : string) : void {
    this.filter = category
    if (this.filter == "name") this.name = this.temporaryName
  }

  applyFilter() : Array<any> {
    switch (this.filter) {
      case "none": 
        this.filtered = this.spells
        break
      case "type":
        this.filtered = this.spells.filter((spell) => spell.type == this.option)
        break
      case "name":
        this.filtered = this.spells.filter((spell) => spell.spell.toLowerCase().includes(this.name.toLowerCase()))
        break
    }
    return this.filtered
  }

  addSpellLocal(id : string) : void {
    this.local = this.storage.addFavouriteLocal("spells", id).spells
  }

  addSpellOnline(id : string) : void {
    this.storage.addFavouriteOnline("spells", id)
  }

  removeSpellLocal(id : string) : void {
    this.local = this.storage.removeFavouriteLocal("spells", id).spells
  }

  removeSpellOnline(id : string) : void {
    this.storage.removeFavouriteOnline("spells", id)
  }

  checkSpellLocal(id : string) : boolean {
    for (var i = 0; i < this.local.length; i++) {
      if (this.local[i] == id) return true
    }
    return false
  }

  checkSpellOnline(id : string) : boolean {
    for (var i = 0; i < this.online.length; i++) {
      if (this.online[i] == id) return true
    }
    return false
  }
}