const { Sequelize } = require("sequelize");

const db = new Sequelize('e_commerce_kedua', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = db