const Favorite = require("../models/FavoriteModel.js");
const Customer = require("../models/CustomerModel.js");
const Product = require("../models/ProductModel.js");
const Stok = require("../models/stok_model.js");

const getFavorite = async (req, res) => {
    const userId = req.userId;
    try {
        const favorites = await Favorite.findAll({
            include: [{
                model: Product,
                include: [{
                    model: Stok,
                    as: 'stok',
                    attributes: ['stok'] // Include stok attribute from Stok model
                }],
                attributes: ['idProduct', 'nama', 'description', 'price', 'image', 'url'], // Include required attributes from Product model
            }, {
                model: Customer
            }],
            where: { userId }
        });
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const getFavoriteById = async (req, res) => {
    try {
        const response = await Favorite.findOne({
            where: {
                idFavorite: req.params.idFavorite,
            },
            include: [{
                model: Customer,
                attributes: ['username', 'email']
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
        const userId = req.userId; // Assuming you're using some sort of auth middleware

        // Ensure the product exists
        const product = await Product.findByPk(idProduct);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if the product is already in the user's favorites
        const existingFavorite = await Favorite.findOne({
            where: { idProduct, userId }
        });
        if (existingFavorite) {
            return res.status(400).json({ error: 'Product is already in favorites' });
        }

        // Create new favorite
        const favorite = await Favorite.create({
            idProduct,
            userId
        });

        res.status(201).json(favorite);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteFavorite = async (req, res) => {
    try {

        const idFavorite = req.params.idFavorite;
        
        await Favorite.destroy({
            where: {
                idFavorite: idFavorite,
            },
        });
        res.status(200).json({ msg: "Favorite Deleted" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getFavorite,
    getFavoriteById,
    createFavorite,
    deleteFavorite
};
