import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class AuthService {

  authCheck$ = new Subject<any>();

  constructor(private _http:HttpClient, private _router:Router, private _cookieService : CookieService) { }

  //User SignUp
  register(userdata){
    this._http.post('http://localhost:3000/register',userdata).subscribe((data:any)=>{
        console.log("REsponce from server ",data);
        if(data.isRegister){
          this._router.navigate(['/login']);
        }
    });
  }

  //User login
  login(userdata){
    console.log("login data ", userdata);
    this._http.post('http://localhost:3000/authenticate',userdata).subscribe((data:any)=>{
        console.log("responce for login from server ",data);
        if(data.isLoggedIn){
          this._cookieService.set('token', data.token);//set token value in cookie
          //set userId to identify which user is loged in
          this._cookieService.set('_id', data.userInfo._id);
          this.authCheck$.next(data.isLoggedIn);//emit observable
          this._router.navigate(['/']);
        }
    })
  }

  //Add Post
  createPost(postdata){
    postdata.user_id=this.checkLoginUser();
    this._http.post('http://localhost:3000/createPost',postdata).subscribe((data:any)=>{
      if(data.isPostCreated){
        alert('Post Added!!');
      }else{
        alert('Failed!! Try again please');
      }
    });
  }

  //Get Alll Posts
  getPosts(){
    return this._http.get('http://localhost:3000/getPosts');
  }

  //Get Comments
  showCommentPostid:any={};
  showComment(postid){
    console.log("show comments from authservice");
    this.showCommentPostid={post_id:postid};
    return this._http.post('http://localhost:3000/getComments',this.showCommentPostid);
  }

  //Add Comments
  insertComment(commentdata){
    console.log('auth service Insert comment ',commentdata);
    return this._http.post('http://localhost:3000/insertComment',commentdata);
  }

  //delete comments
  deleteCommentId:any={};
  deleteComment(commentid){
    this.deleteCommentId={ comment_id : commentid };
    return this._http.post('http://localhost:3000/deleteComment',this.deleteCommentId);
  }

  //add like
  addLike(likeInfo){
    return this._http.post('http://localhost:3000/addLikes', likeInfo);
  }

  //get likers list
  getLikers(postId){
    return this._http.post('http://localhost:3000/likers', postId);
  }

  //Unlike post
  unlikePost(post_id){
    return this._http.post('http://localhost:3000/deleteLike', post_id );
  }

  //Edit Post
  editPost(editPostData){
    return this._http.post("http://localhost:3000/editPost",editPostData);
  }

  //delete post
  deletePost(post_id){
    console.log(post_id);
    return this._http.post("http://localhost:3000/deletePost", post_id);
  }
  

  //retrive token from cookie
  checkUserStatus(){
    return this._cookieService.get('token');
  }

  //retrive which user is logged in currently
  checkLoginUser(){
    return this._cookieService.get('_id');
  } 

  //clear cookie on logout
  clearCookie(){
    this._cookieService.delete('token');
  }
 
  

}
