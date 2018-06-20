import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-editpost',
  templateUrl: './editpost.component.html',
  styles: [`.backdrop. {
    background-color:rgba(0,0,0,0.6);
    position:fixed;
    top:0;
    left:0;
    width:100%;
    height:100vh;
    }`]
})
export class EditpostComponent implements OnInit {

  @Input() PostCliked:any;
  @Output() notify : EventEmitter <String> = new EventEmitter <String>();

  constructor(private _authService : AuthService) { }

  ngOnInit() {
  }

  
  display='none';
  onCloseHandled(){
    this.display='none';
  }

  openModal(){
    this.display='block';
  }

  //save post
  onSavePost(PostCliked){
    console.log("save post ", PostCliked );
    this.editPost(PostCliked);
  }

  //edit post
  editPost(EditPostData){
    console.log("Edit post. I'm clicked", EditPostData);
    this._authService.editPost(EditPostData).subscribe((data:any)=>{
      console.log("REsponce from server", data);
    })
  }

  //delete post
  deletePost(post_id){
    post_id={post_id:post_id}
    this._authService.deletePost(post_id).subscribe((data:any)=>{
      if(data.isPostDeleted){
        console.log("delete conformed");
        this.notify.emit(post_id);
      }else{
        alert("Something went wrong! Please try again to delete")
      }
    })
  }
}
