import { Component, OnInit } from '@angular/core'
import { AuthenticationService } from '../../services/authentication.service'
import { Router } from '@angular/router'

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email : string = ""
  password : string = ""
  logged : boolean = false

  constructor(private authService : AuthenticationService, private router : Router) {}

  ngOnInit() {
    setTimeout(() => {
      if (this.authService.isLoggedIn()) {
        alert("You are already logged in!")
        this.router.navigate([""])
      }
      else this.logged = true
    }, 2500)
  }
}