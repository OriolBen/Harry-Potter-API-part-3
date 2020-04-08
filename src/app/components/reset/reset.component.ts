import { Component, OnInit } from '@angular/core'
import { AuthenticationService } from '../../services/authentication.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})

export class ResetComponent {
  email : string = ""

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