let express = require('express');
let bodyPareser = require('body-parser')
let app = express();
var bodyParser = require("body-parser");
require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.post("/name", (req,res) => {
    var firstName = req.body.first;
    var lastName = req.body.last;
    res.json({name: firstName + " "+lastName});
});

app.get("/:word/echo", (req,res,next)=>{
    const { word } = req.params;
    res.json({echo: word})
    next()
})

app.get("/now", (req,res,next)=>{
    req.time=new Date().toString();
    next()
},(req,res)=>{
    res.json({time: req.time})
})

app.use(function middleware(req,res,next){
 
    console.log(req.method + " " + req.path + " - " + req.ip);
    next();
});

console.log("Hello World");
absoltePath = __dirname + '/views/index.html';
app.get("/", function(req,res) {
    res.sendFile(absoltePath);
})

app.use("/public",express.static(__dirname + "/public"));

app.get("/json", (req,res) => {
    
    if (process.env.MESSAGE_STYLE === "uppercase"){
        res.json({message: "HELLO JSON"})
    }
    else res.json({message: "Hello json"})
})
   


































 module.exports = app;
