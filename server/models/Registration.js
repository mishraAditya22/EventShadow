const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
    date : ()=> Date.now(),
    approval : Boolean,
    owner : String,
    EventTitle : String,
    EventPrice : String,
    EventDate : String,
    UserEmail : String,
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    event : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Event"
    }
});

module.exports = mongoose.model("Registration",RegistrationSchema);
