import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  signup : any={};

  constructor(private _authService : AuthService) { }

  ngOnInit() {
  }

  registerUser(){
    console.log("REgister User clicked");
    this._authService.register(this.signup);
  }

}
