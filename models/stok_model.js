const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const {DataTypes} = Sequelize;

const Stok = db.define('stok', {
    idStok: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate: {  
            notEmpty: true
        }
    },
    idProduct: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stok: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
}, {
    freezeTableName: true
});


module.exports = Stok;

(async()=> {
    await db.sync();
})();