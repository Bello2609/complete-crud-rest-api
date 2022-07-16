const jwt = require("jsonwebtoken");
module.exports = (req, res, next)=>{
    try{
        const token = req.headers.authoriation;
        const decoded = jwt.verify(token, process.env.jwt_key);
        req.userData = decoded;
    }catch(error){
        return res.status(401).json({
            message: "Auth failed"
        });
    }
}
//this module will check if a user is already signed in if true,
// it will allow the user to continue with the operation