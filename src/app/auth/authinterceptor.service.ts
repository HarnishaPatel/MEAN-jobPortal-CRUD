import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHeaders } from '@angular/common/http';
import {AuthService } from './auth.service';

@Injectable()
export class AuthinterceptorService implements HttpInterceptor{

  constructor( private _authService:AuthService) { }

  intercept(req,next){
    var authReq = req.clone({
      headers : new HttpHeaders().set('token', this._authService.checkUserStatus())
  });

  return next.handle(authReq);
  }

}

