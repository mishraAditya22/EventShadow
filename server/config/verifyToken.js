
function verifyToken(req,res,next){
    const bearerToken = req.header('user');
    if(typeof bearerToken!=="undefined"){
        req.token = bearerToken;
        // console.log(req.token);
        next();
    }
    else{
        res.sendStatus(403);
    }
}

module.exports = verifyToken;