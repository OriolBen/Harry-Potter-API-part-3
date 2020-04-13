import { Component, OnInit, NgZone } from '@angular/core'
import { AuthenticationService } from '../../services/authentication.service'

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})

export class BarComponent {
  message : string = ""
  logged : boolean = false

  constructor(private ngZone: NgZone, private authService : AuthenticationService) {}

  ngOnInit() {
    this.authService.afAuth.auth.onAuthStateChanged((user) => {
      this.ngZone.run(() => {
        if (user != null) this.logged = true
        else this.logged = false
      })
    })
  }
}