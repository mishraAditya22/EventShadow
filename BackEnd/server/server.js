const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes/routes');
const path = require('path')
const http = require('http')
const PORT = process.env.PORT || 8000
const app = express()
const server = http.Server(app)
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST", "DELETE"]
	}
});


try{
    mongoose.connect("mongodb+srv://aditya:adityamishra@subscripzz.nprzxdd.mongodb.net/Subscripzz?retryWrites=true&w=majority",{
        useNewUrlParser : true,
        useunifiedTopology: true,
    });
    console.log("MongoDB Connected");
} catch(err){
    console.log(err);
}

const connectUsers = {};

io.on('connection',socket=>{
    // console.log(socket.handshake.query);
    // console.log("connected user-id :-"+socket.id);
    const { user } = socket.handshake.query;
    connectUsers[user] = socket.id;
    
})

app.use((req,res,next)=>{
    req.io = io;
    req.connectUsers = connectUsers;
    return next();
})
app.use(cors());
app.use(express.json());
app.use("/files",express.static(path.resolve(__dirname,"..","files")));
app.use(routes);



server.listen(PORT,()=>{
    console.log(`server started and running on port no ${PORT}`);
});