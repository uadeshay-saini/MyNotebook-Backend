const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User  =  require('../models/User');
const bcrypt  = require('bcryptjs')
const jwt =  require('jsonwebtoken')
const fetchuser = require('../middleware/fetchuser')
const JWT_Secret  =  'SainiShab'

//route 1
router.post('/createuser',[
    body('name', 'Enter a valid name').isLength({min: 3}),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Enter a valid Password').isLength({min: 5}),
    ],
    async (req, res) =>{
        let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({success, errors: errors.array()});
    }
    //check whether user with this email already exists or not
    try{
    let user  = await User.findOne({email: req.body.email});
    if(user){
        success = false;
    return res.status(400).json({success, error: "Sorry a user with this email already exists"})
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    user  = await User.create({
        name: req.body.name,
        password : secPass,
        email: req.body.email
    })
    const data = {
        user:{
            id: user.id
        }
    }
    const authtoken = jwt.sign(data, JWT_Secret)
    // res.json(user)
    success = true;
    res.json({success, authtoken})
    }catch(error){
        success = false;
    res.status(500).send(success, "some error occurred")  }
    // .then(user  => res.json(user))
    // .catch(err =>{res.json({error: "please enter a unique value"})});  
})


//route 2

router.post('/login',[
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'password cannot be blank').exists(),
    ],
    async (req, res) =>{
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const {email, password, name} = req.body;
        try{
            let user = await User.findOne({email});
            if(!user){
                success = false;
                return res.status(400).json({success, error: "please try to login with correct credentials"});
            }
            const passwordCompare = await bcrypt.compare(password, user.password);
            if(!passwordCompare){
                success = false;
                return res.status(400).json({success, error: "please try to login with correct credentials"});
            }
            const data = {
                user:{
                    id: user.id
                }
            }
            let name = user.name;           //user NAME
            const authtoken = jwt.sign(data, JWT_Secret)
            success = true;
            res.json({success, authtoken, name})
        }catch(error){
            res.status(500).send("some error occurred"); 
        }
    })


    //route 3
    router.post('/getuser', fetchuser,
        async (req, res) =>{
            try{
                userId = req.user.id;
                const user  =  await User.findById(userId).select("-password")
                res.send(user)
            }catch(error){
                res.status(500).send("some error occurred"); 
            }
        })
module.exports  =  router