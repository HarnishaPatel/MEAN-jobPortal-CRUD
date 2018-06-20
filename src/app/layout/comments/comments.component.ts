import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, OnChanges {

  toggleCommentCntr : Boolean = false;
  commentsToShow : any = [];
  cmt:any={};
  ClickedPostId : any='';
  loggedInUser : any=''; 

  constructor( private _authService : AuthService) { }

  ngOnInit() {
    this.loggedInUser= this._authService.checkLoginUser();
  }
  
  ngOnChanges(){
    this.commentdata.push("hello");
  }

  //display comments
  comments(post_id) {
    this.ClickedPostId=post_id;
    this.toggleCommentCntr = !this.toggleCommentCntr;
    this._authService.showComment(post_id).subscribe((data:any)=>{
        if (data.isCommentsFound) {
          this.commentsToShow = data.comments;
        } else {
          this.commentsToShow=[];
          alert('No records found');
        }
    });
  }
   
  //Add comment
  commentdata: any = {};
  addComment() {
    this.commentdata = {
      user_id : this.loggedInUser,
      post_id:this.ClickedPostId,
      comment_body: this.cmt.commentbody
    };
    if(this.cmt.commentbody != undefined && this.cmt.commentbody != {}) {
      this._authService.insertComment(this.commentdata)
      .subscribe((data:any)=>{
        if(data.isInsertComment){
          //update view
          this.commentsToShow.splice(this.commentsToShow.length,0,this.cmt.commentbody);
          console.log('comment added', data.comment.comment_body);
        }
      });
    } else {
      alert('cannot add empty comment');
    }
  }

  //delete comment
  index:any='';
  deleteComment(commentid){
    this._authService.deleteComment(commentid).subscribe((data:any)=>{
      if(data.isCommentDelete){
        //update view
        this.index = this.commentsToShow.findIndex(x=>x._id==commentid);
        this.commentsToShow.splice(this.index,1);
      }else{
        alert('error in deleting');
      }
    });
  }

}
