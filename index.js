const express= require ('express')
const bcrypt=require('bcrypt')
const app=express()

const session=require('express-session')


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
app.use(session({secret:'123456',resave:false,saveUninitialized:true}))//cookie creation 
//for parsing the data from html pages to server
app.use(express.static('public'));//express to look for static files

app.use(express.urlencoded({extended:false}))//body parser for converting the incoming request into a js object

app.get("/", (req,res)=>{
    console.log(req.baseUrl);
    res.render("index.ejs")
    console.log(res.cookie);
})
app.post("/signup", (req,res)=>{
 //receive data from frontend
    //hash the password,confirm with password,email validation ,sql injection
    //input validation on the backend 
    //save data on database
    console.log(req.body);
    
    if(req.body.password === req.body.confirm_password){
        //proceed
        let sqlStatement=`INSERT INTO users (email,fullname,password,phone,dob) VALUES("${req.body.email}", "${req.body.fullname}", "${bcrypt.hashSync(req.body.password,5)}", "${req.body.phone}", "${req.body.date}")`//template literals
        myconnection.query(sqlStatement,(sqlerr) => {
            if (sqlerr){
                res.send("database Error")
            }else{
                res.status(304).redirect("/login?signupSuccess=true")
            }
        })
        
    }
    else{
        //check this out 
       render("signup.ejs", {error:true, errMessage: "Password does not match",prevInput:req.body});//sending back sign uo page with some data ie)not all  data in sign up will be lost 
    }
    
})
app.get("/login", (req,res)=>{
    //receive data from client
    //compare cred with what is stored in database and iff it pass/match --create a session 
    //what are sessios and why is http said to be statelss
    if (req.query.signupSuccess){
        res.render("login.ejs", {message:"sign up was successful you can now login"})
    }else{
        res.render("login.ejs")
    }
   

})
app.post("/login",(req, res) => {
    const user = users.find(user => user.id === req.params.id);
    if (!user || user.password !== req.body.password) {
      return res.status(401).json({ error: "Email or Password does not exist"});
}})
app.post("/login",(req,res) => {
    console.log(req.body);
  const ourLoginStat=`SELECT  email,password FROM users WHERE email ='${req.body.email}'`
  myconnection.query(loginsStatement,(sqlerr,userData) => {
    if(sqlerr){
        res.status(500).render("login.ejs",{message: "Internal Server Error contact support"})
    }
    else{//expect an array of json objects from database
      if(userData.length==0){
          res.status(401).render("login.ejs",{message:"Invalid Email or password"})
      }else{
        if(bcrypt.compareSync(req.body.password,userData[0].password)){
            //create a session 
            res.session.user=userData[0]
            /* res.cookie("email",userData[0].email,{maxAge:600})/ *////maximum age of cookie  ,what to be stored 
            res.redirect("/")
        }else{
            
          res.status(401).render("login.ejs",{message:"Invalid Email or password"})
        }
      }
        
  }})
    
})
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


