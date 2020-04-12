import { Component, OnInit, NgZone } from '@angular/core'
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

  constructor(private ngZone: NgZone, private authService : AuthenticationService, private router : Router) {}

  ngOnInit() {
    this.authService.afAuth.auth.onAuthStateChanged((user) => {
      if (user != null) this.ngZone.run(() => this.router.navigate([""]))
    })
  }
}