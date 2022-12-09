const Registration = require("../models/Registration");
const jwt = require('jsonwebtoken');
const verifyToken = require("../config/verifyToken");

module.exports = {
    async create(req, res) {
        const { user_id } = req.headers;
        const { eventId } = req.params;
        const { date } = req.body;

        const registration = await Registration.create({
            user: user_id,
            event: eventId
        })

        await registration
            .populate('event')
            //this was next , but it was causing error so it separately
            // .populate('user')
            // .execPopulate()
        
        //it's working on same operation of line 18
        await registration
            .populate('user','-password')


        registration.owner = registration.event.user;
        registration.EventTitle = registration.event.title;
        registration.EventPrice = registration.event.price;
        registration.EventDate = registration.event.date;
        registration.UserEmail = registration.user.email;

        await registration.save();

        // console.log(registration);

        // console.log(req.connectUsers);
        const ownerSocket = req.connectUsers[registration.event.user];

        if(ownerSocket){
            console.log("Event creater is online !");
            req.io.to(ownerSocket).emit('registration_request',registration);
        }

        return res.json(registration)
    } ,

    async getRegistration(req,res) {
       const { registration_id } = req.params;
       try{
           const registration = await Registration.findById(registration_id);
           await registration
            .populate('event')
            await registration
            .populate('user','-password')
           return res.json(registration); 
       } catch(error){
            res.status(400).json({message:"Registration not found !"});
       }
    } ,
    getAllRequests(req,res) {
        try{
            jwt.verify(req.token,'secret',async(err,authData)=>{
                const { user_id } = req.headers;
                // console.log(user_id);
                try{
                    const response = await Registration.find({"owner":user_id});
                    return res.json(response)
                } catch(err){
                    console.log(err);
                }
            })
        } catch(err){
            console.log(err);
        }
    }
};