const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require('jsonwebtoken');

module.exports = {
    async Store(req,res){
        try{
            const { email , password } = req.body;
            if(!email || !password){
                return res.status(200).json({message:"Required field msissing !"})
            }

            const user = await User.findOne({email});
            if(!user){
                return res.status(200).json({message: "User Not Found , Do you want to register instead"});
            }

            if(user && await bcrypt.compare(password,user.password)){
                const userResponse = {
                    _id : user._id,
                    email : user.email,
                    firstName : user.firstName,
                    lastName : user.lastName
                };

                return jwt.sign({ user : userResponse }, 'secret' , (err,token)=>{
                    return res.json({
                        user : token,
                        user_id : userResponse._id});
                });

                // return res.json(userResponse);
            }
            else{
                return res.status(200).json({message: "Email or Password does not match"});
            }

        } catch(error){
            throw error(`error while authicating a user ${error}`);
        }
    }
}