const express = require('express');
const router = express.Router();
const {check, validation} = require('express-validator');
const validationResult = require('express-validator').validationResult;
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');

const User = require('../../models/User');

//@route    POST api/users
//@desc     Register User
//@access   Public
router.post('/',[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password','Please enter a password with 6 or more characters').isLength({min: 6})
],
async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const {name,email,password} = req.body;
    // See if user exist 
    try{
        let user = await User.findOne({email});
        if(user){
            res.status(400).json({ errors: [{msg: 'User already exist'}] });
        }

        const avatar =gravatar.url(email,{
           s: '200',
           r: 'pg',
           d : 'mm' 
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();
        // return jsonwebtoken
        res.send('User Register');

    }catch(error){
        console.log(error.message);
        res.status(500).send('Server error');
    }



    console.log(req.body);
    
});
module.exports = router;