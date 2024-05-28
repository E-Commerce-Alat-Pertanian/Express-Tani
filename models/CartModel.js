const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const {DataTypes} = Sequelize;

const Cart = db.define('cart', {
    idCart:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        validate:{  
            notEmpty: true
        }
    },
    idProduct: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
}, {
    freezeTableName: true
})

Cart.belongsTo(Product, {foreignKey: 'idProduct'})

module.exports = Cart;

(async()=> {
    await db.sync();
})();