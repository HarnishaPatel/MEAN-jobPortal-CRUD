import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  createPost :any={};

  constructor( private _authService : AuthService) { }

  ngOnInit() {
  }

  user_id:any='';
  createPostFn(){
    this._authService.createPost(this.createPost);
  }


}
