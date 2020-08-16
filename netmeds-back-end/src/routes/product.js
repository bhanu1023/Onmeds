const express = require('express')
const Product = require('../models/product')
const axios = require('axios')

const router = new express.Router()


//fetch all products in DB
router.get('/products',(req,res)=>{
    try {
        Product.findAll({})
        .then((packages)=>{
            res.send(packages)
        })
        .catch(error=>{
            console.log(error)
        })
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router