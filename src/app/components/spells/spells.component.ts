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
  temporaryName : string = ""
  name : string = ""
  option : string = ""
  filter : string = "none"
  filtered : Array<any> = []

  constructor(private api : ApiService, private storage : DataService, private authService : AuthenticationService) {}

  ngOnInit() {
    this.getAllSpells()
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
    this.storage.addFavouriteLocal("spells", id)
  }

  addSpellOnline(id : string) : void {
    this.storage.addFavouriteOnline("spells", id)
  }

  removeSpellLocal(id : string) : void {
    this.storage.removeFavouriteLocal("spells", id)
  }

  removeSpellOnline(id : string) : void {
    this.storage.removeFavouriteOnline("spells", id)
  }

  checkSpellLocal(id : string) : boolean {
    for (let i = 0; i < this.storage.local.spells.length; i++) {
      if (this.storage.local.spells[i] == id) return true
    }
    return false
  }

  checkSpellOnline(id : string) : boolean {
    for (let i = 0; i < this.storage.online.spells.length; i++) {
      if (this.storage.online.spells[i] == id) return true
    }
    return false
  }
}