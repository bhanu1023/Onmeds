const Sequelize = require('sequelize')
const sequelize = require('../db/database')

//cartitem model for cartitem table in DB

const CartItems = sequelize.define('cartItems',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER
})

module.exports = CartItems