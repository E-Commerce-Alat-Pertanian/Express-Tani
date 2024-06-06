const Product = require("../models/ProductModel.js");
const Users = require("../models/UserModel.js");
const Category = require("../models/CategoryModel.js");
const Stok = require("../models/stok_model.js");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");

const getProduct = async (req, res) => {
    try {
        if (req.role === "admin") {
            const product = await Product.findAll({
                include: [{
                    model: Users,
                    attributes: ['username', 'email', 'role']
                }],
            });
            res.status(200).json(product);
        } else {
            const product = await Product.findAll({
                include: [{
                    model: Users,
                    attributes: ['username', 'email', 'role']
                }],
            });
            res.status(200).json(product);
        }

    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


const allProduk = (req, res) => {
    Product.findAll({
        include: [
            { model: Category, as: 'category' },
            { model: Stok, as: 'stok' }
        ]
    })
    .then((data) => {
        res.status(200).json({
            status: true,
            message: "Berhasil mengambil data produk",
            data: data,
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            status: false,
            message: "Terjadi kesalahan, silahkan coba lagi",
            data: {},
        });
    });
};


const getProductById = async (req, res) => {
    try {
        let response;
            response = await Product.findOne({
                attributes: ['idProduct', 'nama', 'description', 'idCategory', 'price', 'image', 'url'],
                where: {
                    idProduct: req.params.idProduct
                },
                include: [{
                    model: Users,
                    attributes: ['username', 'email']
                }]
            })
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
};

const createProduct = async (req, res) => {
    if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" })
    const nama = req.body.nama
    const description = req.body.description
    const idCategory = req.body.idCategory
    const price = req.body.price
    const stock = req.body.stock
    const file = req.files.file
    const fileSize = file.data.length
    const ext = path.extname(file.name)
    const fileName = file.md5 + ext
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`
    const allowedType = ['.png', '.jpg', '.jpeg']

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Image" })

    if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" })

    file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message })
        try {
            await Product.create({
                nama: nama,
                description: description,
                idCategory: idCategory,
                price: price,
                stock: stock,
                image: fileName,
                url: url,
                userId: req.userId
            })
            res.status(201).json({
                msg: "Product berhasil di tambahkan"
            })
        } catch (error) {
            console.log(error.message);
        }
    })
}

const updateProduct = async (req, res) => {
    const product = await Product.findOne({
        where: {
            idProduct: req.params.idProduct,
        },
    });
    if (!product) return res.status(404).json({ msg: "No Data Found" });

    let fileName = "";
    if (req.files === null) {
        fileName = product.image;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = [".png", ".jpg", ".jpeg"];

        if (!allowedType.includes(ext.toLowerCase()))
            return res.status(422).json({ msg: "Invalid Images" });
        if (fileSize > 5000000)
            return res.status(422).json({ msg: "Image must be less than 5 MB" });

        const filepath = `./public/images/${product.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }
    const nama = req.body.nama;
    const description = req.body.description;
    const category = req.body.category;
    const price = req.body.price;
    const stock = req.body.stock;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    try {
        await Product.update(
            {
                nama: nama,
                description: description,
                category: category,
                price: price,
                stock: stock,
                image: fileName,
                url: url,
            },
            {
                where: {
                    idProduct: req.params.idProduct,
                },
            }
        );
        res.status(200).json({ msg: "Product Updated Successfuly" });
    } catch (error) {
        console.log(error.message);
    }
};

const deleteProduct = async (req, res) => {
    const product = await Product.findOne({
      where: {
        idProduct: req.params.idProduct,
      },
    });
    if (!product) return res.status(404).json({ msg: "No Data Found" });
  
    try {
      const filepath = `./public/images/${product.image}`;
      fs.unlinkSync(filepath);
      await Product.destroy({
        where: {
          idProduct: req.params.idProduct,
        },
      });
      res.status(200).json({ msg: "Product Deleted Successfuly" });
    } catch (error) {
      console.log(error.message);
    }
  };

  module.exports = {
    getProduct,
    allProduk,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
  };