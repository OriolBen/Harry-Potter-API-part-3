import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { HomeComponent } from './components/home/home.component'
import { CharactersComponent } from './components/characters/characters.component'
import { CharacterComponent } from './components/character/character.component'
import { HousesComponent } from './components/houses/houses.component'
import { HouseComponent } from './components/house/house.component'
import { SpellsComponent } from './components/spells/spells.component'
import { FavouritesComponent } from './components/favourites/favourites.component'
import { LoginComponent } from './components/login/login.component'
import { RegisterComponent } from './components/register/register.component'
import { ResetComponent } from './components/reset/reset.component'
import { AccountComponent } from './components/account/account.component'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'characters',
    component: CharactersComponent
  },
  {
    path: 'characters/:id',
    component: CharacterComponent
  },
  {
    path: 'houses',
    component: HousesComponent
  },
  {
    path: 'houses/:id',
    component: HouseComponent
  },
  {
    path: 'spells',
    component: SpellsComponent
  },
  {
    path: 'favourites',
    component: FavouritesComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'reset',
    component: ResetComponent
  },
  {
    path: 'account',
    component: AccountComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
