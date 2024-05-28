const Favorite = require("../models/FavoriteModel.js");
const Customer = require("../models/CustomerModel.js");
const Product = require("../models/ProductModel.js");

const getFavorite = async (req, res) => {
    try {
        const response = await Favorite.findAll({
            include: [{
                model: Customer,
                attributes: [ 'username', 'email']
            }],
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
    }
};

const getFavoriteById = async (req, res) => {
    try {
        const response = await Favorite.findOne({
            where: {
                idFavorite: req.params.idFavorite,
            },
            include: [{
                model: Customer,
                attributes: [ 'username', 'email']
            }],
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
};

const createFavorite = async (req, res) => {
    try {
      const { idProduct } = req.body;
  
      // Ensure the product exists
      const product = await Product.findByPk(idProduct);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      const favorite = await Favorite.create({
        idFavorite: uuidv4(), // or however you're generating this
        idProduct,
        userId: req.user.id, // Assuming you're using some sort of auth middleware
      });
  
      res.status(201).json(favorite);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

const deleteFavorite = async (req, res) => {
    try {
        await Favorite.destroy({
            where: {
                idFavorite: req.params.idFavorite,
            },
        });
        res.status(200).json({ msg: "Favorite Deleted" });
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    getFavorite,
    getFavoriteById,
    createFavorite,
    deleteFavorite
};