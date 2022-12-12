const jwt = require('jsonwebtoken');
const Event = require("../models/Event");

module.exports = {

    getEventById(req,res){
        jwt.verify(req.token,'secret',async(err,authData)=>{
            if(err)
                res.sendStatus(403);
            else{
                const { eventId } = req.params;
                // console.log("eventById "+req.token);
                try{
                    const event = await Event.findById(eventId);
                    if(event){
                        return res.json(event);
                    }
                } catch(error){
                    return res.status(400).json({message : "EventId Does not existes"});
                }
            }
        })
    } ,

    getAllevents(req,res){
        jwt.verify(req.token,'secret',async(err,authData)=>{
            if(err)
                res.sendStatus(403);
            else{
                try{
                    const { user , user_id } = req.headers
                    const event = await Event.find({});
                    if(event){
                        return res.json(event);
                    }
                } catch(error){
                    return res.status(400).json({message : "We Don't have any Events Now"});
                }
            }
        })
    }  ,

    getAlleventById(req,res){
        var g = req.token;
        // console.log("byId "+g);
        jwt.verify(g,"secret",async(err,authData)=>{
            if(err)
                res.sendStatus(403);
            else{
                const {sport} = req.params;
                const query = {sport} || {};
                try{
                    const event = await Event.find(query);
                    if(event){
                        return res.json(event);
                    }
                } catch(error){
                    return res.status(400).json({message : "We Don't have any Events Now"});
                }
            }
        })
    } ,

    getAllUserEvents(req,res){
        jwt.verify(req.token,'secret',async(err,authData)=>{
            if(err)
                res.sendStatus(403);
            else{
                const { user_id } = req.headers;
                // console.log("byEvent "+req.token);
                try{
                    const event = await Event.find({user:user_id});
                    return res.status(200).json(event);
                } catch(err){
                    return res.status(400).json({message: "No Event Found !"})
                }
            }
        })
    }
}