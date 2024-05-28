const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");
const Product = require("./ProductModel.js")
const Customer = require("./CustomerModel.js")

const {DataTypes} = Sequelize;

const Favorite = db.define('favorite', {
    idFavorite:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        validate:{  
            notEmpty: true
        }
    },
    idProduct: DataTypes.STRING,
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    freezeTableName: true
})

Favorite.belongsTo(Product, {foreignKey: 'idProduct', onDelete: "CASCADE"})
Favorite.belongsTo(Customer, {foreignKey: 'userId', onDelete: "CASCADE"})

module.exports = Favorite;

(async()=> {
    await db.sync();
})();