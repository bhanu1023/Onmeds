const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const router = new express.Router()

//api to login user
router.post('/login',(req,res)=>{
    try {
        const {username,password} = req.body
        User.findOne({where:{
            email: username
        }})
        .then(async (result)=>{
            if(!result){
                res.status(401).send() //unauthorized access if no user found
                return
            }
            const savedPassword = result.password
            const isUser = await bcrypt.compare(password,savedPassword) //hash compare with password by user and hash in DB
            if(isUser){
                req.session.user = result
                req.session.save()
                console.log(req.session)
                const {id,name,email} = result
                res.status(200).send({id,name,email}) //send user detail if password math for same email address
            }else{
                res.status(401).send('Unauthorized') //unauthorized access if no user found
            }
        })
        .catch(err=>{
            console.log(err)
        })
    } catch (error) {
        res.status(500).send() //Server error
    }
})


module.exports = router