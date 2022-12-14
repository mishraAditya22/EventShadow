const Registration = require("../models/Registration");
const jwt = require('jsonwebtoken');

module.exports = {
    approval(req,res) {
        try{
            jwt.verify(req.token,'secret', async(err,authData)=>{
                if(err){
                    res.sendStatus(403);
                }
                else{
                    const { registration_id } = req.params;
                    try{
                        const registration = await Registration.findById(registration_id);
                        registration.approval = true;
                        await registration.save();
                        return res.json(registration);
                    } catch(error){
                        return res.status(400).json(error);
                    }
                }
            })
        }
        catch(err){
            res.status(400).json({"message":err});
        }
        
    }
}