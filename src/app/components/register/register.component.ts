import { Component, OnInit } from '@angular/core'
import { AuthenticationService } from '../../services/authentication.service'
import { Router } from '@angular/router'

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent  {
  email : string = ""
  password : string = ""

  constructor(private authService : AuthenticationService, private router : Router) {}

  ngOnInit() {
    setTimeout(() => {
      if (this.authService.isLoggedIn()) {
        alert("You are already logged in!")
        this.router.navigate([""])
      }
    }, 2500)
  }
}