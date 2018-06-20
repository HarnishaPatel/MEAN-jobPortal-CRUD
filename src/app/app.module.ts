import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';


import { AppComponent } from './app.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { NavigationComponent } from './layout/navigation/navigation.component';
import {AuthService} from './auth/auth.service';
import {CookieService} from 'ngx-cookie-service';
import { HomeComponent } from './layout/home/home.component';
import { CreatePostComponent } from './layout/create-post/create-post.component';
import { ViewPostComponent } from './layout/view-post/view-post.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthinterceptorService } from './auth/authinterceptor.service';
import { CommentsComponent } from './layout/comments/comments.component';
import { LikeComponent } from './layout/like/like.component';
import { EditpostComponent } from './layout/editpost/editpost.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    NavigationComponent,
    HomeComponent,
    CreatePostComponent,
    ViewPostComponent,
    CommentsComponent,
    LikeComponent,
    EditpostComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path :'login', component:LoginComponent },
      { path :'register', component:RegisterComponent },
      { path:'home' ,component:HomeComponent, canActivate:[AuthGuard]},
      { path:'createPost', component:CreatePostComponent, canActivate:[AuthGuard]},
      { path:'viewPost' , component:ViewPostComponent , canActivate:[AuthGuard]},
      { path:'comments' , component:CommentsComponent, canActivate:[AuthGuard]},
      // rootpath
      { path:'', redirectTo:'home', pathMatch:'full'},
      // invalid path
      { path:'**', redirectTo:'home'}
    ])
  ],
  providers: [AuthService, CookieService, AuthGuard,
    {//diff way for declaring interceptors service in provider  
    provide : HTTP_INTERCEPTORS,
    useClass : AuthinterceptorService,
    multi : true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
