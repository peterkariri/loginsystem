const express= require ('express')
const bcrypt=require('bcrypt')
const app=express()

const mysql = require('mysql')

const myconnection=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"login_system"
})
//texting for error
myconnection.connect((err, connection) => {
    if(err){
        console.log(err.message);
    }else{
        console.log("database is  connected successfully");
    }
})
myconnection.query("CREATE TABLE IF NOT EXISTS users (userid INT NOT NULL AUTO_INCREMENT,email VARCHAR(255),fullname VARCHAR(255),password VARCHAR(255),phone VARCHAR(255),dob DATE,PRIMARY KEY (userid));",
   (sqlerr,data)=>{
    if(sqlerr){
     console.log(sqlerr.message);
    }else{
        console.log("table was created");
        console.log(data);
    }
   })
const port=3000
//using middlware functions
app.use((req,res,next)=>{
    console.log("this is a middleware functions,runs on every request");
    next();
})
/* middleware can be used for authentication ie)making sure that requests being received are from logged in users
since http is stateless
http is stateless implies that every request-response cyclye is completely independent ,even if they are form the same device */

app.use(express.static('public'));//express to look for static files

app.use(express.urlencoded({extended:false}))//body parser for converting the incoming request into a js object

app.get("/", (req,res)=>{
    console.log(req.baseUrl);
    res.render("index.ejs")
})
app.post("/signup", (req,res)=>{
 //receive data from frontend
    //hash the password,confirm with password,email validation ,sql injection
    //input validation on the backend 
    //save data on database
    console.log(req.body);
    
    if(req.body.password === req.body.confirm_password){
        //proceed
        let sqlStatement=`INSERT INTO users (email,fullname,password,phone,dob) VALUES("${req.body.email}", "${req.body.fullname}", "${req.body.password}", "${req.body.phone}", "${req.body.date}")`//template literals
        myconnection.query(sqlStatement,(sqlerr) => {
            if (sqlerr){
                res.send("database Error")
            }else{
                res.send("sign up successful")
            }
        })
        
    }
    else{
        res.send("make sure that password and confirm password match")
    }
    
})
app.get("/login", (req,res)=>{
    //receive data from client
    //compare cred with what is stored in database and iff it pass/match --create a session 
    //what are sessios and why is http said to be statelss
    res.render("login.ejs")
})
app.post("/login",(req, res) => {
    const user = users.find(user => user.id === req.params.id);
    if (!user || user.password !== req.body.password) {
      return res.status(401).json({ error: "Email or Password does not exist"});
}})

app.get("/signup", (req,res)=>{
   
    console.log(req.path);
    /* console.log(res.setHeader({status:300})); */
    console.log(req.query);
    res.render("signup.ejs")
})

app.get("/protectedRouteOne", (req,res)=>{
    
    res.send("only the logged in users! ")
})
app.get("/protectedRouteTwo", (req,res)=>{
    
    res.send("only the logged in users! ")
})

app.get("/protectedRouteThree", (req,res)=>{
    
    res.send("only the logged in users!")
})

app.get("*", (req,res)=>{
    res.status(404).send("Page Not Found ")
})
app.listen(port,()=>{
    console.log("server listening on port 3000");
})


