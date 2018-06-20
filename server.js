var express = require('express'),
    app= express(),
    cors = require ('cors'),
    bodyParser = require ('body-parser'),
    jwt = require ('jsonwebtoken'),
    mongoose = require ('mongoose'),
    Schema = mongoose.Schema;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
    
app.use(express.static('dist'));

//**********************************Mongoose**************************************/
mongoose.connect('mongodb://localhost/ang2test');
//user
var userSchema = new Schema({
    user_name:{ type: String, required : true},
	user_email:{ type: String, required:true},
	user_pw:{ type: String, required: true},
});
var user = mongoose.model('users', userSchema);
//post
var postSchema = new Schema({
    post_user_id:{ type: String, required:true },
    post_title:{type:String, required:true},
    post_description:{type:String, required:true}
});
var post= mongoose.model('posts',postSchema);
//comment
var commentSchema = new Schema({
    cmt_post_id : {type:String, required:true},
    cmt_user_id:{ type:String, required:true},
    comment_body : { type:String, required:true}
});
var comment = mongoose.model('comments',commentSchema);
//like 
var likeSchema = new Schema({
    like_post_id : {type: String, required:true},
    like_user_id : { type: String, required:true},
    like_user_name : { type: String, required:true},
});
var like = mongoose.model('likes', likeSchema);

//*********************************Express*******************************************/
//----------allow port 4200 request--------
app.use(cors({
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}));

//---------SignUp-----------
app.post('/register',(req,res)=>{
    console.log('create user');
    var user1 = new user({
		user_name : req.body.name,
		user_email : req.body.email,
		user_pw : req.body.password,
    });
    user1.save(function(err,resc){
        if(err){ 
            console.log('Error in registering user : ',err);
            return res.send({
                isRegister : false,
                msg : 'Register Failed'
            });
        }else{
            console.log('user record Inserted',resc);
            return res.send({
                isRegister : true,
                msg : 'Register success'
            });
        }
    });
});

//---------login & generate token------------
app.post('/authenticate',(req,res)=>{
    console.log('Authenticate--login= ',req.body); 
    if(req.body.email && req.body.password){
        var query= user.findOne( {'user_email' : req.body.email,
                                    'user_pw' : req.body.password });                            
        query.exec((err,result)=>{
            if(result!=null){
                console.log('User Record Found result is: ',result);
                var token= jwt.sign({
                        email: req.body.email
                    },
                    'marlabs-secret-key',//secret key for encryption
                    {expiresIn:'1h'}
                );       
                res.send({
                    isLoggedIn : true,
                    msg:'Login success',
                    token : token,
                    userInfo : result
                });
            }else{
                console.log('No Record Exists');
                res.send({          
                    isLoggedIn:false,
                    msg:'No-record Found'
                });  
            }
        });
        
    }else{
        console.log('No Email & password Received');
        res.send({          
            isLoggedIn:false,
            msg:'Login failed'
        });
    }
});

//-------Check wether token is in every request made-------
app.use((req,res,next)=>{
    // console.log('check cookie in header set or not', req.headers.token);
    console.log('check cookie in body set or not', req.body.token);
    var token = req.body.token || req.query.token || req.headers.token;
    if(token){
        jwt.verify(token,'marlabs-secret-key',(err,decoded)=>{
            if(!err){
                // console.log('Hey checking!!',decoded);
                req.decoded=decoded;
                next();//point next task here it is /getproducts
            }else{
                console.log('error in cookie ',err);
                res.send({
                    msg:'No cookie found',
                    isLoggedIn:false
                });
            }
        });
    }else{
        res.send({
            msg:'Invalid Request No cookie found',
            isLoggedIn:false
        });
    }
});

//--------create post-----------------
app.post('/createPost',(req,res)=>{
    console.log("create post data: ",req.body);
    var post1 = new post({
        post_user_id :req.body.user_id,
        post_title : req.body.title,
        post_description : req.body.description
    });
    post1.save((err,resc)=>{
        if(err){
            console.log('Error in creating post : ', err);
            return res.send({
                isPostCreated : false,
                msg:'create post failed'
            });
        }else{
            console.log('Post created!!!');
            return res.send({
                isPostCreated : true,
                msg: 'Post Created!!'
            });
        }
    })
});

//--------return list of all posts----------
app.get('/getPosts', (req,res)=>{
    console.log('Get posts Called');
    var query = post.find();
    query.exec((err,resp)=>{
        if(resp!=null){
           console.log('Posts found');
            res.send({
                isPostsFound : true,
                products : resp,
                msg : 'Posts found!!' 
            });     
        }else{
            res.send({
                isPostsFound : false,
                msg : 'Error in finding Post'
            });
        }
    });
});

//----------Edit Post-----------------
app.post('/editPost',(req,res)=>{
        //find post and update
        post.findByIdAndUpdate(req.body._id,{
            post_title : req.body.post_title,
            post_description : req.body.post_description
        },{new:true})
        .then(post=>{
            if(!post){
                return res.send({
                    msg: "Post not found with this id "+req.body._id
                });
            }
            res.send(post);
        }).catch(err=>{
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    msg: 'note not found with this id'
                })
            }
            return res.status(500).send({
                msg: 'Error updating post'
            });
        });
})

//-----------Delete Post--------------
app.post('/deletePost',(req,res)=>{
    console.log("DElete post ", req.body);
    post.findByIdAndRemove(req.body.post_id)
    .then(post=>{
        if(!post){
            return res.status(404).send({
                isPostDeleted : false,
                msg:"post not found with this id"
            })
        }
        console.log("deleted");
        res.send({
            isPostDeleted : true,
            msg:'post deleted successfully'
        })
    }).catch(err=>{
        if(err.kind === 'ObjectId' || err.name === 'NotFound'){
            return res.status(404).send({
                isPostDeleted : false,
                msg:"post not found"
            })
        }
        return res.status(505).send({
            isPostDeleted : false,
            msg: "could not delete post with the id"
        })
    })    
});

//----------Add comments--------------
app.post('/insertComment',(req,res)=>{
    console.log("insert comment data: ",req.body);
    var comment1 = new comment({
        cmt_post_id : req.body.post_id,
        cmt_user_id : req.body.user_id, 
        comment_body : req.body.comment_body
    });
    comment1.save((err,resc)=>{
        if(err){
            console.log('Error in add comment : ', err);
            return res.send({
                isInsertComment : false,
                msg:'Insert comment failed'
            });
        }else{
            console.log('Comment Added!!!');
            return res.send({
                isInsertComment : true,
                comment : resc,
                msg: 'comment Added!!'
            });
        }
    })
});

//----------Delete Comment-----------
app.post('/deleteComment',(req,res)=>{
    comment.remove({'_id' : req.body.comment_id}, (err)=>{
        if(true){
            console.log('Comment Deleted');
            res.send({
                isCommentDelete : true,
                msg : 'Comment Deleted'
            });
        }else{
            console.log('Error comment not deleted ',err);
            res.send({
                isCommentDelete : false, 
                msg : 'Failed in Deleting comment '
            });
        }
    });
});

//------------return comments-------------
app.post('/getComments', (req,res)=>{
    console.log('Get comments Called ', req.body);
    var query = comment.find({'cmt_post_id' : req.body.post_id} );
    query.exec((err,resp)=>{
        if(resp!=null){
           console.log('comments found',resp);
            res.send({
                isCommentsFound : true,
                comments : resp,
                msg : 'comments found!!' 
            });     
        }else{
            res.send({
                isCommentsFound : false,
                msg : 'Error in finding comments'
            });
        }
    });
});

//-------------Add Likes & return info about that comment-----------------
app.post('/addLikes', (req,res)=> {
    console.log('add likes ', req.body);
    var userName='';
    //find username from userid
    var query = user.findOne({'_id': req.body.user_id}, 'user_name' , (err, resp)=>{
        if(!err){
                var like1 = new like({
                    like_post_id : req.body.post_id,
                    like_user_id : req.body.user_id,
                    like_user_name : resp.user_name //find from user_id and assign
                });
                like1.save((err, result)=>{
                    if(err){
                        console.log('Error in add like : ', err);
                        return res.send({
                            isLike : false,
                            msg:'Insert like failed'
                        });
                    }else{
                        console.log('like Added!!!');
                        return res.send({
                            isLike : true,
                            comment : result,
                            msg: 'Like Added!!'
                        });
                    }
                });
        }else{
            console.log("error " , err);
        }
    });  
});

//--------------display name of likers----------------
app.post('/likers', (req,res)=>{
    console.log('likeers called ', req.body);
    var query = like.find({'like_post_id': req.body.post_id});
    query.exec((err,resp)=>{
        if(resp!=[]){
            console.log('likes found');
             res.send({
                isLikesFound : true,
                responce : resp,
                msg : 'likes found!!' 
             });     
         }else{
             res.send({
                isLikesFound : false,
                msg : 'Error in finding likes or no likes'
             });
         } 
    });
});

//-------------delete likes-------------------
app.post('/deleteLike', (req,res)=>{
     console.log("delete like req ", req.body);
    like.remove({ 'like_post_id': req.body.post_id , 'like_user_id' : req.body.user_id }, (err)=>{
        if(true){
            console.log('Like Deleted');
            res.send({
                isLikeDelete : true,
                msg : 'Like Deleted'
            });
        }else{
            console.log('Error Like not deleted ',err);
            res.send({
                isLikeDelete : false, 
                msg : 'Failed in Deleting Like '
            });
        }
    });
})

// app.get('/',(req,res)=>{
//     res.sendFile(__dirname+'/dist/index.html');
// });

app.listen(3000, function(){
    console.log('Server running @ localhost 3000');
});