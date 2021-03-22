const express = require('express');
const Router = express.Router();

const { check, validationResult } =  require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');


// route     post  api/post
//discrption   create a post route
//access   private
Router.post('/',[auth , [
    check('text' , 'text is required').not().isEmpty()
]],
async (req,res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors : errors.array()});
    }


    try{


        const user = await User.findById( req.user.id ).select('-password');

    const newPost = new Post({
        text : req.body.text,
        name : user.name,
        avatar : user.avatar,
        user : req.user.id
    })


    const post = await newPost.save();

    res.json(post);


    }catch(err){
        console.error(err.message);
        res.status(500).send('server error in create post');
    }

    
});



// route     get  api/post
//discrption   get post
//access   private

Router.get('/' , auth , async ( req , res)=>{
    

    try{
        const posts = await Post.find().sort({ date : -1});
        res.json(posts);
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error in get all posts');
    }
});





// route     get  api/post/:id
//discrption   get post by id
//access   private

Router.get('/:id' , auth , async ( req , res)=>{
    

    try{
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({ msg : 'post is not found'});
        }
        res.json(post);
    }catch(err){
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({ msg : 'post is not found'});
        }
        res.status(500).send('server error in get post by id');
    }
});




// route     delete api/post/:id
//discrption   delete post
//access   private

Router.delete('/:id' , auth , async ( req , res)=>{
    

    try{
        const post = await Post.findById( req.params.id );


        if(!post){
            return res.status(404).json({ msg : 'post is not found'});
        }

        if( post.user.toString() !== req.user.id){
            return res.status(401).json({ msg : 'user not authorized'});
        }

        await post.remove();


        res.json({ msg : 'post removed'});
    }catch(err){
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({ msg : 'post is not found'});
        }
        res.status(500).send('server error in delete post');
    }
});



// route     put api/post/like/:id
//discrption   like post
//access   private

Router.put('/like/:id' , auth , async(req , res ) => {


    try{

        const post = await Post.findById( req.params.id );

        

        //if post already likeed
        if(post.likes.filter( like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json( { msg : 'post already liked'});
        }

        post.likes.unshift( { user : req.user.id } );

        await post.save();

        res.json(post.likes); 

    }catch(err){
        console.error(err.message);
        res.status(500).send('server error in like posts');
    }
});





// route     put api/post/unlike/:id
//discrption   like post
//access   private

Router.put('/unlike/:id' , auth , async(req , res ) => {


    try{

        const post = await Post.findById( req.params.id );

        //if post already liked 
        if(post.likes.filter( like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json( { msg : 'post has not yet been liked'});
        }

        //get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        

        post.likes.splice(removeIndex , 1);

        await post.save();

        res.json(post.likes); 

    }catch(err){
        console.error(err.message);
        res.status(500).send('server error in unlike posts');
    }
});




// route     post  api/post/comment/:id
//discrption   comment on a post
//access   private
Router.post('/comments/:id',[auth , [
    check('text' , 'text is required').not().isEmpty()
]],
async (req,res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors : errors.array()});
    }


    try{


        const user = await User.findById( req.user.id ).select('-password');
        const post = await Post.findById(req.params.id);



    const newComment = {
        text : req.body.text,
        name : user.name,
        avatar : user.avatar,
        user : req.user.id
    }


    post.comments.unshift(newComment);


    await post.save();

    res.json(post.comments);


    }catch(err){
        console.error(err.message);
        res.status(500).send('server error in write comment');
    }

    
});



// route     delete  api/post/comment/:id/:comment_id
//discrption   delete comment 
//access   private


Router.delete('/comments/:id/:comment_id' , auth , async (req,res)=>{
   

    try{

        const post = await Post.findById(req.params.id);
       

        //pullout comment

        const comment = post.comments.find(comment => comment.id === req.params.comment_id );


        //make sure comment exists

        if(!comment){
            return res.status(404).json( {msg : 'comment not found'});
        }

        //check user
        if(comment.user.toString() !== req.user.id ){
            return res.status(401).json( {msg : ' not authorized user'});
        }

          //get remove comment
          const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
        

          post.comments.splice(removeIndex , 1);
  
          await post.save();
  
          res.json(post.comments); 
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error in delete comment');
    }
});

module.exports = Router;
