const express = require("express");
const app = express();
//routes
const productRouter = require("./route/product");
const orderRouter = require("./route/order");
const userRouter = require("./route/user");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const urlencoded = require("body-parser/lib/types/urlencoded");
const mongoose = require("mongoose");


app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



app.use(orderRouter);
app.use(productRouter);
app.use(userRouter);
//error handling 
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Orign", "*");
    res.header("Access-Control-Allow-Control", 
    "Origin, X-Requested-Width, Content-Type, Accept, Authorization");
    if(req.method === "OPTION"){
        res.header("Access-Control-Allow-Method", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
})
app.use((req, res, next)=>{
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});
app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
});

mongoose.connect("mongodb+srv://bellohadi:bellohadi@cluster0.4hiah.mongodb.net/restful").then(res=>{
    console.log(res);
    app.listen(8000, ()=>{
        console.log("my server is runing on port 8000");
    });
}).catch(err=>{
    console.log(err);
});
