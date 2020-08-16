const Sequelize = require('sequelize')
const sequelize = require('../db/database')


//product model for product table in DB

const Product = sequelize.define('product',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    labName: {
        type: Sequelize.STRING,
        allowNull: true
    }
});


module.exports = Product
