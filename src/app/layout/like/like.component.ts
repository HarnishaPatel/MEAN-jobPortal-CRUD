import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.css']
})
export class LikeComponent implements OnInit {

  toggleLike: boolean = false;
  likes = [];

  constructor(private _authService: AuthService) { }

  ngOnInit() {
  }

  @Input() PostCliked:string;


  demo(){
    console.log("demo clicked!! ", this.PostCliked);
  }

  //add likes
  likeInfo:any={};
  like() {
    console.log("like cliked!!", this.PostCliked);
    this.likeInfo={
      post_id : this.PostCliked,
      user_id : this._authService.checkLoginUser()
    }
    this._authService.addLike(this.likeInfo).subscribe((data:any)=>{
      console.log("data from server ",data);
    });
    this.toggleLike = true;
  }

  //get all likers
  likePostId:{};
  getliker(){
    console.log("like cliked!!", this.PostCliked);
    this.likePostId={ post_id: this.PostCliked };
    this._authService.getLikers(this.likePostId).subscribe((data:any)=>{
      console.log("responce from server ", data.responce)
      this.likes = data.responce;
    })
  }

  //Unlike post
  unlikePostId:{}
  unlike() {
    this.unlikePostId={post_id:this.PostCliked, user_id: this._authService.checkLoginUser() };
    this._authService.unlikePost(this.unlikePostId).subscribe((data:any)=>{
      console.log(data);
    })
    this.toggleLike = false;
  }
}
