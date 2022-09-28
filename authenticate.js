import express from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { getuserbyemail,genPassword,createUser } from "./helper.js";

const router = express.Router();

router.post("/login",async function(req, res) {
    const {email,password} = req.body;
    const userFromDB =  await getuserbyemail(email);
    if(!userFromDB){
        res.status(401).send({msg:"incorrect credentials"})
        return
    }
    const storedPassword = userFromDB.password

    const isPasswordMatch = await bcrypt.compare(password, storedPassword)

    if(isPasswordMatch){
        const token = jwt.sign({id:userFromDB._id, role:userFromDB.role}, process.env.SECRET_KEY)
        res.send({msg:"successfull login",userFromDB:{...userFromDB, token:token}})
    }else{
        res.status(401).send({msg: "incorrect credentials"})
    }

})


router.post("/register",async function(req, res) {
    const {username, password,email,role, location} = req.body
    const userFromDB = await getuserbyemail(email)

    if(userFromDB){
        res.status(400).send({msg:"email already exists"})
        return
    }
    if(password.length < 8){
        res.status(400).send({msg: "password must be longer"})
        return
    }

     const hashedpassword = await genPassword(password);

     const result = await createUser({username, password:hashedpassword, role, email, createdAt: new Date()})

    if(result.acknowledged === true){
        res.send({msg:"user created sucessfully"})
    }
    else{
        res.status(400).send({msg:"try again.."})
    }
})

export const userrouter = router;



