require("dotenv").config();
var express = require("express");
var app = express();
var favicon = require("serve-favicon");
app.use(favicon(__dirname+'/public/pictures/favico.ico'));
var mongoose = require("mongoose");
var ejs =require("ejs");
const bodyParser = require("body-parser");
mongoose.connect("mongodb://localhost:27017/bank", {useNewUrlParser: true , useUnifiedTopology:true});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
const user = mongoose.Schema({
    name:String,
    email:String,
    balance:Number,
    accountno:Number
});
const details = mongoose.model("users",user);
app.set("view engine","ejs");
app.get('/',(req,res)=>{
    
    res.render("home");
});
app.get('/select',(req,res)=>{
    details.find({},(err,result)=>{
        res.render("select",{user:result});    
    });
    
});
app.get("/submit",(req,res)=>{
   res.render("submit"); 
});
app.post("/select",(req,res)=>{
    details.find({accountno:req.body.accountno},(err,result)=>{
        if(!err){
            if(result.length){
                console.log(result);
        res.render("select",{user:result});    
     }else{
         res.render("ERROR");
     } }});
});
app.get('/transfer',(req,res)=>{
    details.find({},(err,result)=>{
        res.render("transfer",{user:result});
    });
   
});
var amnt;
var ite;
app.post("/login",(req,res)=>{
   var a;
   if(req.body.accountno1.length){
    a = req.body.accountno1;
   }else{
   a=req.body.accountno;
   }
   details.find({accountno:a},(err,result)=>{
        if(!err){
            if(result.length){
                amnt=parseInt(req.body.amount);
                ite = result[0].balance;
                res.render("login",{ite:result,value:req.body.amount});
            }
            else{
                res.render("ERROR");
            }
        }
    });
    
});
app.get("/transfered",(req,res)=>{
    console.log(amnt);
    console.log(ite);
    var left = amnt+ite;
res.render("transfered",{item:amnt,piece:left});
});
app.listen(process.env.PORT||3000,()=>{
  console.log("listening on port 3000");
});
