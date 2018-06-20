import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {

  posts: any = [];

  constructor(private _authService: AuthService) { }
  
  ngOnInit() {
    this._authService.getPosts().subscribe((data: any) => {
      if (data.isPostsFound) {
        this.posts = data.products;
      } else {
        console.log('error in loading posts', data.msg);
      }
    });
  }

  //update view of deleted post
  //find index of post


  index:any='';
  postToDelete(post_id){
    console.log("post id from child ",post_id);
    this.index = this.posts.findIndex(x=>x._id==post_id);
    this.posts.splice(this.index,1);
  }
  
}
