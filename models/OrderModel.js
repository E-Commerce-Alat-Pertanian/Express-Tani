const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");
const Customer = require("./CustomerModel.js");
const Cart = require("./CartModel.js");

const { DataTypes } = Sequelize;

const Order = db.define('orders', {
  idOrder: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Pending",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  metodeBayar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ongkir: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalPembayaran: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  freezeTableName: true,
});

Order.belongsTo(Customer, { foreignKey: 'userId', onDelete: "CASCADE" });
Order.hasMany(Cart, { foreignKey: 'idOrder', onDelete: "CASCADE" }); // Add this line

module.exports = Order;

(async () => {
  await db.sync();
})();
