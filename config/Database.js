const { Sequelize } = require("sequelize");

const db = new Sequelize('e_commerce', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = db