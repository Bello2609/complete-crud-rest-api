const User = require("../model/user"); 
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.postSignUp = (req, res, next)=>{
    const { name, email, password } = req.body;
    User.find({ email: email }).exec().then(user =>{
        if(user.length >= 1){
            return res.status(409).json({
                message: "Mail Exists"
            })
        }else{
            bcrypt.hash(password, 10, (err, hash)=>{
                if(err){
                    return res.status(500).json({
                        error: err
                    })
                }else{
                    const user = new User({
                        name: name,
                        email: email,
                        password: hash
                    });
                    user.save().then(result=>{
                        res.status(201).json({
                            message: "A user is created"
                        })
                    }).catch(err=>{
                        res.status(500).json({
                            message: err
                        })
                    })
                }
            })
        }
    })
}
exports.postSignIn = (req, res, next)=>{
    const { email, password } = req.body;
    User.find({ email: email }).exec().then(user=>{
        if(user.length < 1){
            return res.status(401).json({
                message: "Auth not successful"
            })
        }
        bcrypt.compare(password, user[0].password, (err, result)=>{
            if(err){
                return res.status(401).json({
                    message: "Auth not successful"
                });
            }
            if(result){
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                },
                process.env.jwt_key,
                {
                    expiresIn: "1h"
                }
                )
                return res.status(200).json({
                    message: "Auth successful",
                    token: token
                });
            }
            return res.status(401).json({
                message: "Auth not successful"
            });
        })
    })
}