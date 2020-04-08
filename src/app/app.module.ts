// Modules
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { RouterModule } from '@angular/router'
import { AppRoutingModule } from './app-routing.module'

// Firebase
import { AngularFireModule } from '@angular/fire'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFireDatabaseModule } from '@angular/fire/database'

// Services
import { ApiService } from './services/api.service'
import { DataService } from './services/data.service'
import { AuthenticationService } from './services/authentication.service'

// Components
import { AppComponent } from './app.component'
import { HomeComponent } from './components/home/home.component'
import { CharactersComponent } from './components/characters/characters.component'
import { CharacterComponent } from './components/character/character.component'
import { HousesComponent } from './components/houses/houses.component'
import { HouseComponent } from './components/house/house.component'
import { SpellsComponent } from './components/spells/spells.component'
import { FooterComponent } from './components/footer/footer.component'
import { FavouritesComponent } from './components/favourites/favourites.component'
import { LoginComponent } from './components/login/login.component'
import { RegisterComponent } from './components/register/register.component'
import { BarComponent } from './components/bar/bar.component'
import { ResetComponent } from './components/reset/reset.component'
import { AccountComponent } from './components/account/account.component'

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyDcp3ojggM75TPgdLz6zUAaZrlWLIetEiA",
      authDomain: "harry-potter-api-e764c.firebaseapp.com",
      databaseURL: "https://harry-potter-api-e764c.firebaseio.com",
      projectId: "harry-potter-api-e764c",
      storageBucket: "harry-potter-api-e764c.appspot.com",
      messagingSenderId: "375890053637",
      appId: "1:375890053637:web:1f83020707079f55e2aa6c"
    }),
    AngularFireDatabaseModule
  ],
  declarations: [ 
    AppComponent,
    HomeComponent,
    CharactersComponent,
    HousesComponent,
    SpellsComponent,
    CharacterComponent,
    HouseComponent,
    FooterComponent,
    FavouritesComponent,
    LoginComponent,
    RegisterComponent,
    BarComponent,
    ResetComponent,
    AccountComponent
  ],
  bootstrap: [ 
    AppComponent
  ],
  providers: [
    ApiService,
    DataService,
    AngularFireAuth,
    AuthenticationService
  ]
})

export class AppModule { }
