const { create } = require("../models/User");
const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = {
    async createUser(req,res){
        try {
            const { firstName , lastName , password , email } = req.body;
            
            const existentUser = await User.findOne({email});

            if(!existentUser){
                const hashedPassword = await bcrypt.hash(password,12);
                const user = await User.create({
                    firstName : firstName,
                    lastName : lastName,
                    password : hashedPassword,
                    email : email
                });
                return res.json({
                    _id : user._id,
                    firstName : user.firstName,
                    lastName : user.lastName,
                    email : user.email
                });
            }
            
            res.status(201).send({message : "Email/User already Registered , Do you want to Login instead!"});

        } catch(error){
            res.Error(`error while registering a new user ${error}`);
        }
    },
    async getAllUsers(req,res){
        try{
            const users = await User.find({});
            return res.json(users);
        } catch(error){
            res.status(400).send({message: "Try Some Time later !"});
        }
    },
    async getUserById(req,res){
        const { userId } = req.params;
        try{
            const user = await User.findOne(userId);
            return res.json(user);
        } catch(error){
            res.status(400).send({message : "User ID does not exits , Do you want to Register instead!"});
        }
    }
};