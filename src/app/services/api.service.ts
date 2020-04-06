import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable()
export class ApiService {
  readonly apiKey = "$2a$10$UD/i1boaxVbc18ID7VvX3OpjR0BVvUHZi92xxucNXtutx1KCPTChW"

  constructor(private http: HttpClient) {}

  getAllCharacters() {
    const apiURL = "https://www.potterapi.com/v1/characters" + "?key=" + this.apiKey
    return this.http.get(apiURL)
  }

  getCharacter(id : string) {
    const apiURL = "https://www.potterapi.com/v1/characters/" + id + "?key=" + this.apiKey
    return this.http.get(apiURL)
  }

  getAllHouses() {
    const apiURL = "https://www.potterapi.com/v1/houses" + "?key=" + this.apiKey
    return this.http.get(apiURL)
  }

  getHouse(id : string) {
    const apiURL = "https://www.potterapi.com/v1/houses/" + id + "?key=" + this.apiKey
    return this.http.get(apiURL)
  }

  getAllSpells() {
    const apiURL = "https://www.potterapi.com/v1/spells" + "?key=" + this.apiKey
    return this.http.get(apiURL)
  }
}