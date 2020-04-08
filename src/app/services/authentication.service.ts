import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
import { AngularFireDatabase } from '@angular/fire/database'

@Injectable()

export class AuthenticationService { 
  user
  userDetails : firebase.User = null 
  displayName : string = ""
  logged : boolean = false

  constructor(private afAuth : AngularFireAuth, private router : Router, private db : AngularFireDatabase) {
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
      this.checkLogIn()
    }).catch((e) => alert(e.message))
  }

  signInRegular(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((result) => {
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
      this.checkLogIn()
    }).catch((e) => alert(e.message))
  }

  loginRegular(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password).then((result) => {
      if (result.user.emailVerified !== true) {
        this.afAuth.auth.currentUser.sendEmailVerification()
        alert("Successful login.\nPlease verify your email address.")
      }
      else alert("Successful login.")
      this.router.navigate([""])
      this.checkLogIn()
    }).catch((e) => alert(e.message))
  }

  isLoggedIn() : boolean {
    return this.logged
  }

  logout() {
    this.logged = false
    return this.afAuth.auth.signOut().then((res) => this.router.navigate([""]))
  }

  resetPasswordEmail(email: string) { 
    return this.afAuth.auth.sendPasswordResetEmail(email).then((res) => alert('A password reset link has been sent to your email address'), (rejectionReason) => alert(rejectionReason)).catch(e => alert('An error occurred while attempting to reset your password')).then((res) => this.router.navigate([""]))
  }

  checkOobCode(mode : string, oobCode : string) {
    if (mode == "resetPassword") {
      return this.afAuth.auth.verifyPasswordResetCode(oobCode).catch(e => {
        alert(e.message)
        this.router.navigate([""])
      })
    }
    else if (mode == "verifyEmail") {
      return this.afAuth.auth.applyActionCode(oobCode).then((res) => alert("Email has been verified")).catch(e => alert(e.message)).then((res) => this.router.navigate([""]))
    }
  }

  resetPassword(oobCode : string, password : string) {
    return this.afAuth.auth.confirmPasswordReset(oobCode, password).then((res) => {
      alert('New password has been saved')
      this.router.navigate(["/login"])
    }).catch(e => alert(e.message))
  }
}