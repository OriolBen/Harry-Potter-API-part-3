import { Injectable, NgZone } from '@angular/core'
import { Router } from '@angular/router'
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
import { AngularFireDatabase } from '@angular/fire/database'

@Injectable()

export class AuthenticationService { 
  user : any = null
  userDetails : firebase.User = null 
  displayName : string = ""
  logged : boolean = false

  constructor(private ngZone: NgZone, public afAuth : AngularFireAuth, private router : Router, private db : AngularFireDatabase) {
    this.afAuth.auth.onAuthStateChanged((user) => {
      if (user == null) {
        this.userDetails = null
        this.logged = false
      }
      else {
        this.userDetails = user
        this.displayName = (this.userDetails.displayName) ? this.userDetails.displayName : this.userDetails.email
        this.logged = true
      }
    })
  }

  signInGoogle() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then((result) => {
      this.logged = true
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
      this.ngZone.run(() => this.router.navigate([""]))
    }).catch((e) => alert(e.message))
  }

  signInRegular(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((result) => {
      this.logged = true
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
      this.ngZone.run(() => this.router.navigate([""]))
    }).catch((e) => alert(e.message))
  }

  loginRegular(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password).then((result) => {
      this.logged = true
      if (result.user.emailVerified !== true) {
        this.afAuth.auth.currentUser.sendEmailVerification()
        alert("Successful login.\nPlease verify your email address.")
      }
      else alert("Successful login.")
      this.ngZone.run(() => this.router.navigate([""]))
    }).catch((e) => alert(e.message))
  }

  isLoggedIn() : boolean {
    return this.logged
  }

  logout() {
    this.logged = false
    return this.afAuth.auth.signOut().then(() => this.ngZone.run(() => this.router.navigate([""])))
  }

  resetPasswordEmail(email: string) { 
    return this.afAuth.auth.sendPasswordResetEmail(email).then(() => alert('A password reset link has been sent to your email address'), (rejectionReason) => alert(rejectionReason)).catch(e => alert('An error occurred while attempting to reset your password')).then(() => this.ngZone.run(() => this.router.navigate([""])))
  }

  checkOobCode(mode : string, oobCode : string) {
    if (mode == "resetPassword") {
      return this.afAuth.auth.verifyPasswordResetCode(oobCode).catch(e => {
        alert(e.message)
        this.ngZone.run(() => this.router.navigate([""]))
      })
    }
    else if (mode == "verifyEmail") {
      return this.afAuth.auth.applyActionCode(oobCode).then(() => alert("Email has been verified")).catch(e => alert(e.message)).then(() => this.ngZone.run(() => this.router.navigate([""])))
    }
  }

  resetPassword(oobCode : string, password : string) {
    return this.afAuth.auth.confirmPasswordReset(oobCode, password).then(() => {
      alert('New password has been saved')
      this.ngZone.run(() => this.router.navigate(["/login"]))
    }).catch(e => alert(e.message))
  }
}