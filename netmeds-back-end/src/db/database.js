const Sequilize = require('sequelize');
require('dotenv').config()

//creating connection with database
const sequelize = new Sequilize(process.env.MYSQL_DB,process.env.MYSQL_USER,process.env.MYSQL_PASS,{
    dialect: 'mysql',
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT
})

module.exports = sequelize