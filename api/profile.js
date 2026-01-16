const express=require('express');
const router=express.Router();
const auth=require('../middlewear/auth');
const Profile=require('../models/profile');
const User=require('../models/User');
const {check,validationResult}=require('express-validator');

//api/profile/me
//get current users profile
router.get('/me',auth,async (req,res)=>{
    try{
        const profile=await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);

        if(!profile){
            return res.status(400).json({msg:'There is no profile for this user'});
        }

        res.json(profile);
    }
    catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});


//post api/profile/
//reate or update user profile
router.post(
    '/',
    [
        auth,
        [
            check('status', 'Status is required').not().isEmpty(),
            check('skills', 'Skills are required').not().isEmpty()
        ]
    ],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
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

        // Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;

        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;

        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: req.user.id });

            if (profile) {
                // UPDATE
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );

                return res.json(profile);
            }

            // CREATE
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

//get api/profile

router.get('/',async(req,res)=>{
    try{
        const profiles=await Profile.find().populate('user',['name','avatar']);;
        res.json(profiles);
    }
    catch(err){
        console.log(err);
        res.status(500).send('Server Error');
    }
})

//user/userid
router.get('/user/:user_id',async(req,res)=>{
    try{
        const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        //we are findingone profile by user id: how we get user id we typed t that is from params.
        if(!profile) return res.status(400).json({msg:'There is no profile for this user.'});

         return res.json(profile);
    }
    catch(err){
        console.log(err.message);
        if(err.kind=='ObjectId'){
            return res.status(400).json({msg:'There is no profile for this user.'});
        } //if invalid object id.
        res.status(500).send('Server Error');
    }
});

//delete request
router.delete('/',auth,async(req,res)=>{
    try{
        //remove profile
        await Profile.findOneAndDelete({user:req.user.id});

        //remove user
        await User.findOneAndDelete({_id:req.user.id});
    }
    catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

//put request for experience 
//add profile experience
router.put('/experience',[auth,[
    check('title','Title is required').not().isEmpty(),
    check('company','Company is required').not().isEmpty(),
    check('from','From date is required').not().isEmpty()
]],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    //get the data from request body
    const{
        title,
        company,
        from,
        to,
        current,
        description
    }=req.body;

    const newExp={
        title,
        company,
        from,
        to,
        current,
        description
    };

    try{
        const profile=await Profile.findOne({user:req.user.id});

        profile.experience.unshift(newExp); //unshift adds at the beginning of array.
        await profile.save();
        res.json(profile)
    }
    catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

//delete expereince/:exp_id
//delete experience from profile

router.delete('/experience/:exp_id',auth,async(req,res)=>{
    try{
        const profile=await Profile.findOne({user:req.user.id});
        //get remove index
        const removeIndex=profile.experience.map(item=>item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex,1);
        await profile.save();

        res.json(profile);
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({msg:'Server Error'});
    }
});


//education now
router.put('/education',[auth,[
    check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty()
]],
    async(req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
            const {
                school,
                degree,
                fieldofstudy,
                from,
                to,
                current,
                description
            }= req.body;

            const newEdu={
                school,
                degree,
                fieldofstudy,
                from,
                to,
                current,
                description
            };
            try{
            const profile= await Profile.findOne({user:req.user.id});
            profile.education.unshift(newEdu);
            profile.save();
            res.json(profile);
            }
        catch(err){
            console.log(err.message);
            res.status(500).json({'msg':'Server Error'});
        }
});

//delete also works same.

module.exports = router;