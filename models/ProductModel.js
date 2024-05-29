const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/Database.js");
const Users = require("./UserModel.js");
const Category = require("./CategoryModel.js");
const Stok = require("./stok_model.js");

const Product = db.define('product', {
    idProduct: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    nama: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    image: DataTypes.STRING,
    url: DataTypes.STRING,
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // validate: {
        //     notEmpty: true
        // }
    },
    idCategory: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

Category.hasMany(Product, { foreignKey: 'idCategory' });
Product.belongsTo(Category, { foreignKey: 'idCategory' });
Users.hasMany(Product);
Product.belongsTo(Users, { foreignKey: 'userId' });
Product.hasMany(Stok, { foreignKey: 'idProduct' });

module.exports = Product;

(async () => {
    await db.sync();
})();
