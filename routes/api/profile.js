const express = require('express');
const Router = express.Router();
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

const { check, validationResult } = require('express-validator');



const auth = require('../../middleware/auth');

// route     get  api/profile/me
// discrption   get current user profile route
// access value  private
Router.get('/me', auth , async (req,res)=>{
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', [
            'name' , 'avatar'
        ]);


        if(!profile){
            return res.status(400).json({
                msg : 'there is no profile of current user'
            });
        }


        res.json(profile);

        
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error'); 
    }
});



// route     POST api/profile
//discrption   create  or upgate profile route
//access value  private

Router.post('/',[ auth , [
    check('status', 'status is required')
    .not()
    .isEmpty(),
    check('skills','skills is required')
    .not()
    .isEmpty()
]
],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors : errors.array()
        })
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    // build profile object

    const profileFields = {};
    profileFields.user = req.user.id;
    if(company)profileFields.company = company;
    if(website)profileFields.website = website;
    if(location)profileFields.location = location;
    if(bio)profileFields.bio = bio;
    if(status)profileFields.status = status;
    if(githubusername)profileFields.githubusername = githubusername;
    if(skills){
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }


    //build social object 
    profileFields.social = {};
    if(youtube)profileFields.social.youtube = youtube;
    if(twitter)profileFields.social.twitter = twitter;
    if(facebook)profileFields.social.facebook = facebook;
    if(instagram)profileFields.social.instagram = instagram;
    if(linkedin)profileFields.social.linkedin = linkedin;

    try{
        let profile = await Profile.findOne({ user : req.user.id });

        if(profile){
            //update profile

            profile = await Profile.findOneAndUpdate(
                { user :  req.user.id },
                {$set : profileFields },
                {new: true }
                );

                return res.json(profile);
        }



        //create profile
        profile = new Profile(profileFields);

        await profile.save();
         res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error in create profile');
    }



});

// route     get api/profiles
//discrption   get all profiles
//access value  public

Router.get('/', async (req,res)=>{
    try{
        const profiles = await Profile.find().populate('user', ['name','avatar']);

        res.json(profiles);
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error in get all profiles');
    }
});



// route     get api/profile/user/:user_id
//discrption   get  profile by id 
//access value  public

Router.get('/user/:user_id', async (req,res)=>{
    try{
        const profile = await Profile.findOne({ user : req.params.user_id }).populate('user', ['name','avatar']);

        if(!profile){
            return res.status(400).json({ msg : 'no profile fond!'});
        }

        res.json(profile);
    }catch(err){
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(400).json({ msg : 'no profile fond! '});
        }
        res.status(500).send('server error in profile get by user_id');
    }
});



// route     delete api/profile
//discrption   delete profile , user , post
//access value  public

Router.delete('/', auth ,  async (req,res)=>{
    try{
        
        //remove user post
        await Post.deleteMany({ user: req.user.id });

        //remove profile
        await Profile.findOneAndRemove({ user : req.user.id });
        //remove user
        await User.findOneAndRemove({ _id : req.user.id });


        res.json({ msg : 'User removed' });
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error in delete user ,profile, post');
    }
});



// route     PUT api/profile/experience
//discrption   add profile experience
//access value  private

Router.put('/experience',[auth , [
    check('title' , 'tital is requried')
    .not()
    .isEmpty(),
    check('company' , 'company is requried')
    .not()
    .isEmpty(),
    check('from' , 'from is requried')
    .not()
    .isEmpty()
]], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json( { errors : errors.array()})
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {};
    if(title)newExp.title = title;
    if(company)newExp.company = company;
    if(location)newExp.location = location;
    if(from)newExp.from = from;
    if(to)newExp.to = to;
    if(current)newExp.current = current;
    if(description)newExp.description = description;


   //uper and lower both can use 
//const newExp = {
//     title,
//     company,
//     location,
//     from,
//     to,
//     current,
//     description
// };


    try{
        const profile = await Profile.findOne({ user : req.user.id });

        profile.Experience.unshift(newExp);

        await profile.save();

        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error in add experience');
    }
});

// route     delete api/profile/experience/:exp_id
//discrption   delette experience from profile
//access value  private

Router.delete('/experience/:exp_id',auth, async (req,res)=>{
    try{
        const profile = await Profile.findOne({
            user : req.user.id
        });

        //get correct experience to delete
        const removeIndex =  profile.Experience.map(item => item.id)
        .indexOf(req.params.exp_id);

        profile.Experience.splice(removeIndex , 1);

        await profile.save();

        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error in delete experience');
    }
});



// route     PUT api/profile/Education
//discrption   add profile Education
//access value  private

Router.put('/education',[auth , [
    check('school' , 'school is requried')
    .not()
    .isEmpty(),
    check('degree' , 'degree is requried')
    .not()
    .isEmpty(),
    check('fieldOfStudy' , 'fieldOfStudy is requried')
    .not()
    .isEmpty(),
    check('from' , 'from is requried')
    .not()
    .isEmpty()
]], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json( { errors : errors.array()})
    }

    const {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
    school,
    degree,
    fieldOfStudy,
    from,
    to,
    current,
    description
};


    try{
        const profile = await Profile.findOne({ user : req.user.id });

        profile.Education.unshift(newEdu);

        await profile.save();

        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error in add experience');
    }
});

// route     delete api/profile/education/:edu_id
//discrption   delette education from profile
//access value  private

Router.delete('/education/:edu_id',auth, async (req,res)=>{
    try{
        const profile = await Profile.findOne({
            user : req.user.id
        });

        //get correct Education to delete
        const removeIndex =  profile.Education.map(item => item.id)
        .indexOf(req.params.edu_id);

        profile.Education.splice(removeIndex , 1);

        await profile.save();

        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error in delete Education');
    }
});



module.exports = Router;