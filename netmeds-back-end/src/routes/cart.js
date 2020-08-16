const express = require('express')
const Cart = require('../models/cart')
const Product = require('../models/product')
const axios = require('axios')
const bcrypt = require('bcrypt')
const authsession = require("../middleware/auth")
const User = require('../models/user')


const router = new express.Router()

//get all product stored for user logged in
router.get('/mycart',authsession,async (req,res)=>{
    try {
        const user = await new User(req.session.user) //get sequelize user  currently logged in  session
        user.getCart() // get user cart
        .then(cart=>{
            return cart.getProducts({}) //get all products in cart
        })
        .then(product=>{
            res.status(200).send(product)
        })
        .catch(error=>{
            res.status(500).send()
        })
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/addtocart',authsession,async (req,res)=>{
    try {
        const productid = req.query.id
        let fetchedCart;
        const user = await new User(req.session.user) //get sequelize user currently logged in session
        user.getCart() // get user cart
        .then(cart=>{
            fetchedCart = cart
            return cart.getProducts({where: {id: productid}}) //get product stored in cart from product id
        })
            .then(product=>{
                let newQuantity = 1;
                if(product.length>0){ //check prod present in cart
                    newQuantity = product[0].cartItems.quantity + 1
                    fetchedCart.addProduct(product[0],{through: {quantity: newQuantity}}) //add prod with incremented quantity
                    .then(result=>{
                        res.status(200).send({...product[0].cartItems.dataValues,quantity: newQuantity})
                    })
                    .catch(err=>res.status(500).send())
                }
                Product.findByPk(productid)
                .then(prod=>{
                    return fetchedCart.addProduct(prod,{through: {quantity: newQuantity}}) //add product to cart if not present with 1 quantity
                })
                    .then(result=>res.status(200).send(result))
                    .catch(err=>res.status(500).send())
            })
        .catch(err=>console.log(err))
    } catch (error) {
        res.status(500).send()
    }
})


router.get('/removeCartItem',authsession,async (req,res)=>{
    try {
        const productid = req.query.id
        let fetchedCart;
        const user = await new User(req.session.user) //get sequelize user currently logged in session
        user.getCart()
        .then(cart=>{
            fetchedCart = cart
            return cart.getProducts({where: {id: productid}}) //get product stored in cart from product id
        })
            .then(product=>{
                if(product.length>0){ 
                   let newQuantity = product[0].cartItems.quantity - 1 //decrease quantity by 1
                    if(newQuantity > 0){ // if product quantity is more than 0
                        fetchedCart.addProduct(product[0],{through: {quantity: newQuantity}}) //decreament quantity
                        .then(result=>{
                            return fetchedCart.getProducts({}) //return updated cart products
                        })
                        .then(result=>{res.status(200).send(result)})
                        .catch(err => res.status(500).send(err))
                    }else{
                        fetchedCart.removeProduct(productid) //remove product if quantity gets 0
                        .then(result=>{
                            return fetchedCart.getProducts({}) //return updated cart products
                        })
                        .then(result=>{res.status(200).send(result)})
                        .catch(err => res.status(500).send(err))
                    }
                }else{
                    res.send(200).send()
                }
            })
            
        .catch(err=>console.log(err))
    } catch (error) {
        res.status(500).send()
    }
})


module.exports = router