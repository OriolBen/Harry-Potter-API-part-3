import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthenticationService } from '../../services/authentication.service'

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})

export class AccountComponent implements OnInit {
  password : string = ""
  verified : boolean = false
  mode : string = ""
  oobCode : string = ""

  constructor(private authService : AuthenticationService, private route : ActivatedRoute, private router : Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode']
      this.oobCode = params['oobCode']
    })
    switch (this.mode) {
      case undefined:
        this.mode = "normal"
        break
      case "resetPassword":
        this.authService.checkOobCode(this.mode, this.oobCode)
        break
      case "verifyEmail":
        setTimeout(() => { this.authService.checkOobCode(this.mode, this.oobCode) }, 2500)
        break
      default:
        alert("URL is not valid")
        this.router.navigate([""])
        break
    }
  }
}