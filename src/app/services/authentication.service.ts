import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
import { AngularFireDatabase } from '@angular/fire/database'
import { DataService } from './data.service'

@Injectable()

export class AuthenticationService { 
  user : any = null
  userDetails : firebase.User = null 
  displayName : string = ""
  logged : boolean = false

  constructor(private afAuth : AngularFireAuth, private router : Router, private db : AngularFireDatabase, private storage : DataService) {
    this.checkLogIn()
  }

  checkLogIn() {
    this.user = this.afAuth.authState
    this.user.subscribe((user) => { 
      if (user) {
        this.userDetails = user
        this.displayName = (this.userDetails.displayName) ? this.userDetails.displayName : this.userDetails.email
        this.logged = true
      } 
      else {
        this.userDetails = null
        this.logged = false
      }
    })
  }

  signInGoogle() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then((result) => {
      this.checkLogIn()
      this.db.database.ref(result.user.uid).once("value").then((snapshot) => {
        if (snapshot.val() === null) {
          this.db.database.ref(result.user.uid).set({
            house: "",
            characters: "",
            spells: "",
          })
        }
      })
      alert("Successful login.")
      this.router.navigate([""])
    }).catch((e) => alert(e.message))
  }

  signInRegular(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((result) => {
      this.checkLogIn()
      this.db.database.ref(result.user.uid).once("value").then((snapshot) => {
        if (snapshot.val() === null) {
          this.db.database.ref(result.user.uid).set({
            house: "",
            characters: "",
            spells: "",
          })
        }
      })
      this.afAuth.auth.currentUser.sendEmailVerification()
      alert("Successful registration.\nPlease verify your email address.")
      this.router.navigate([""])
    }).catch((e) => alert(e.message))
  }

  loginRegular(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password).then((result) => {
      this.checkLogIn()
      if (result.user.emailVerified !== true) {
        this.afAuth.auth.currentUser.sendEmailVerification()
        alert("Successful login.\nPlease verify your email address.")
      }
      else alert("Successful login.")
      this.router.navigate([""])
    }).catch((e) => alert(e.message))
  }

  isLoggedIn() : boolean {
    return this.logged
  }

  logout() {
    this.logged = false
    return this.afAuth.auth.signOut().then(() => this.router.navigate([""]))
  }

  resetPasswordEmail(email: string) { 
    return this.afAuth.auth.sendPasswordResetEmail(email).then(() => alert('A password reset link has been sent to your email address'), (rejectionReason) => alert(rejectionReason)).catch(e => alert('An error occurred while attempting to reset your password')).then(() => this.router.navigate([""]))
  }

  checkOobCode(mode : string, oobCode : string) {
    if (mode == "resetPassword") {
      return this.afAuth.auth.verifyPasswordResetCode(oobCode).catch(e => {
        alert(e.message)
        this.router.navigate([""])
      })
    }
    else if (mode == "verifyEmail") {
      return this.afAuth.auth.applyActionCode(oobCode).then(() => alert("Email has been verified")).catch(e => alert(e.message)).then(() => this.router.navigate([""]))
    }
  }

  resetPassword(oobCode : string, password : string) {
    return this.afAuth.auth.confirmPasswordReset(oobCode, password).then(() => {
      alert('New password has been saved')
      this.router.navigate(["/login"])
    }).catch(e => alert(e.message))
  }
}