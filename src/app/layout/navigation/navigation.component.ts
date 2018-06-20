import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  toggleMenuItems : any = false;

  constructor(private _authService :AuthService) { }

  ngOnInit() {
    this._authService.authCheck$.subscribe((data)=>{
      console.log(data);
      this.toggleMenuItems=data;
    });
    this.toggleMenuItems = this._authService.checkUserStatus();
  }

  logout(){
    this._authService.clearCookie();
  }

}
