const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");
const Product = require("./ProductModel.js");

const {DataTypes} = Sequelize;

const Category = db.define('category', {
    idCategory:{
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        validate:{  
            notEmpty: true
        }
    },
    nama: {
        type: DataTypes.STRING,
        allowNull:false
},
}, {
    freezeTableName: true
})

module.exports = Category;

(async()=> {
    await db.sync();
})();