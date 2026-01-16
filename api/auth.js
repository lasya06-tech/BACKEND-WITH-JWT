const express=require('express');
const router=express.Router();
const auth=require('../middlewear/auth');
const jwt=require('jsonwebtoken');
const config=require('config');
const bcrypt=require('bcrypt');
const {check,validationResult}=require('express-validator');
//api/auth

const User=require('../models/User');
router.get('/',auth,async(req,res)=>{
    try{
        const user=await User.findById(req.user.id).select('-password');
        res.json(user);

    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
//getting the details of logged in user.


//route api/auth
//authentication login
router.post('/',[

    check('email','Please include a valid email').isEmail(),

    check('password','Password is required').exists()
],
async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {email,password}=req.body;
    try{
        let user=await User.findOne({email});  //User is model object.

        if(!user){
           return res.status(400).json({errors:[{msg:'Invalid Credentials'}]});
        }

    //see if user exists

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({errors:[{msg:'Invalid Credentials'}]});
    }

    const payload={
        user:{
            id:user.id
        }
    }

    jwt.sign(payload,config.get('jwtSecret'),{expiresIn:36000},
     (err,token)=>{
        if(err) throw err;
        res.json({token});
     });
    //return jsonWebtoken
    

     }
    catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});




module.exports=router;

//to get respone auth route we need to enter key as x-auth-route amd value as token the only we see the output as auth route.