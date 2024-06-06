const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");
const Product = require("./ProductModel.js");
const Customers = require("./CustomerModel.js");
const Order = require("./OrderModel.js");
const Stok = require("./stok_model.js");

const {DataTypes} = Sequelize;

const Cart = db.define('keranjang', {
    idCart:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        validate:{  
            notEmpty: true
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
      idOrder: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    idProduct: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

    idStok: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    // total: DataTypes.INTEGER,
}, {
    freezeTableName: true
})

Cart.belongsTo(Product, {foreignKey: 'idProduct', onDelete: "CASCADE"})
Cart.belongsTo(Customers, {foreignKey: "userId"})
// Cart.belongsTo(Order,{ foreignKey: "idOrder", onDelete: "CASCADE" })
Cart.belongsTo(Stok,  { foreignKey: "idStok", onDelete: "CASCADE" })

module.exports = Cart;

(async()=> {
    await db.sync();
})();