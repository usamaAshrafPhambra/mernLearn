const express = require('express');
const Router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
// to check user data correct 
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
// route     get  api/auth
//discrption   test route
//access value  public 
Router.get('/',auth, async (req,res)=>
{
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
});


// route     post api/auth
//discrption   authenticate user & get token
//access value  public 
Router.post('/',[
    check('email','please enter email').isEmail(),
    check('password','please enter correct password').exists()
],
async (req,res)=>{
    //if there errors then how send response to user and messsage vesible to user 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }


      const {email, password} = req.body;

      try{
      //email, user name not correct then send err to user   
      let user = await User.findOne({ email});

      if(!user){
        return  res.status(400).json({errors : [{msg : 'Invalid email'}]});
      }

      //match password 
      const isMatch = await bcrypt.compare(password , user.password);
      
      if(!isMatch){
        return  res.status(400).json({errors : [{msg : 'Invalid password'}]});
      }


      //payload variable 
        const payload = {
          user:{
            id: user.id
          }
        }


        jwt.sign(
          payload , 
          config.get('jwtSecret'),
          {expiresIn:36000000000},
          (err,token)=>{
            if(err) throw err;
            res.json({ token })
          });

      }catch(err){
          console.error(err.message);
          res.status(500).send('server error');
      }
     
    
});

module.exports = Router;