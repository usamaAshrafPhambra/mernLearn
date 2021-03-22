const express = require('express');
const Router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
// to check user data correct 
const { check, validationResult } = require('express-validator');
//import module of user 
const User = require('../../models/User');

// route     post api/user
//discrption   register user
//access value  public 
Router.post('/',[
    check('name', 'please enter name').not().isEmpty(),
    check('email','please enter email').isEmail(),
    check('password','please enter password with minimum 6 digits').isLength({min:6})
],
async (req,res)=>{
    //if there errors then how send response to user and messsage vesible to user 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }


      const {email, name , password} = req.body;

      try{
      //if user already exists then send err to user   
      let user = await User.findOne({ email});

      if(user){
        return  res.status(400).json({errors : [{msg : 'user aleady exists'}]});
      }

      //use gravatar to get profail of user 
      const avatar = gravatar.url(email,{
          s:'200',
          r:'pg',
          d:'mm'
      })

      //create user 
      user = new User({
          name,
          email,
          avatar,
          password
      });


      //encrypting the password 
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
      // save user in database
      await user.save();



      // return json web token


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