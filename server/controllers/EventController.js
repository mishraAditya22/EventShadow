const Event = require("../models/Event");
const User = require("../models/User");
const jwt = require('jsonwebtoken');

module.exports = {
    createEvent(req,res){
        try{
            jwt.verify(req.token,'secret',async(err,authData)=>{
                if(err)
                    res.sendStatus(403);
                else{
                    const { title , description , price , sport , date } = req.body;
                    // console.log(req.headers);
                    const { user_id } = req.headers;
                    const { filename } = req.file;

                    const user = await User.findById(user_id);
                    if(!user){
                        return res.status(400).json({message : "User Does not existes"});
                    }
                    const event = await Event.create({
                        title ,
                        description  ,
                        price : parseFloat(price),
                        user : user_id ,
                        thumbnail : filename,
                        sport : sport ,
                        date
                    });
                    return res.json(event);
                }
            })
        }
        catch(err){
            return res.status(400).json({message : "EventId Does not existes"});
        }
    },

    Delete(req,res){
        try{
            jwt.verify(req.token,'secret',async(err,authData)=>{
                if(err)
                    res.sendStatus(403);
                else{
                    const { eventId } = req.params;
                    try{
                        await Event.findByIdAndDelete(eventId);
                        return res.status(204).json({message : "Done"});
                    } catch(error){
                        return res.status(400).json({message: "we don't have any event with this ID"})
                    }
                }
            })
        }
        catch(err){
            return res.status(400).json({message : "EventId Does not existes"});
        }
    }
}