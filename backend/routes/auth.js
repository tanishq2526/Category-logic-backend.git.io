const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")

const user = require("../models/User")

router.post('/register', async(req, res) => {
    try{
        const {name, email, password, role } = req.body;
        const newUser = await new user({
            name,
            email,
            password,
            role,
        })
        await user.save();

        res.status(201).express()
    }catch (error){
        
    }
});

router.post('/register-admin', async(req, res) => {
    try{

    }catch (error){

    }
});

router.post('/login', async(req, res) => {
    try{

    }catch (error){

    }
});