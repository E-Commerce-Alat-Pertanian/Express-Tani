const OrderModel = require("../models/OrderModel");
const StokModel = require("../models/stok_model");
const KeranjangController = require("../controllers/keranjang_controller");
const Customers = require("../models/CustomerModel");
const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");
const path = require("path");
const fs = require("fs");

class OrderController {
  static async createOrder(req, res) {
    const order = req.body.order;
    const listKeranjangRaw = req.body.keranjang;
    const userId = req.userId;
  
    if (order.metodeBayar === "COD") {
      order.status = "Dikirim";
    }
  
    try {
      // Buat order baru
      const newOrder = await OrderModel.create({ ...order, userId });
  
      // Perbarui entri keranjang dengan idOrder dari order baru
      const listKeranjang = listKeranjangRaw.map((keranjang) => {
        keranjang.idOrder = newOrder.idOrder;
        return keranjang;
      });
  
      // Kurangi stok
      const promises = listKeranjang.map((keranjang) => {
        return StokModel.decrement("stok", {
          where: { idStok: keranjang.idStok },
        });
      });
  
      await Promise.all(promises);
  
      // Perbarui entri keranjang di database
      await KeranjangController.updateKeranjangLocal(listKeranjang, userId);
  
      res.status(201).json({
        status: true,
        message: "Berhasil membuat order",
        data: newOrder,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silahkan coba lagi",
        data: {},
      });
    }
  }

  static async getOrder(req, res) {
    const userId = req.userId;
    try {
      const orders = await OrderModel.findAll({
        include: [
          {
            model: Customers,
          },
          {
            model: Cart,
            as: 'keranjangs',
            include: [
              {
                model: Product, // Include model Product dalam include Cart
              },
              {
                model: StokModel, // Include model Stok dalam include Cart
              },
            ],
          },
        ],
        where: { userId },
      });
      res.status(200).json({
        status: true,
        message: "Berhasil mengambil data order",
        data: orders,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silahkan coba lagi",
        data: {},
      });
    }
  }

  static uploadPembayaran = async (req, res) => {
    const order = await OrderModel.findOne({
      where: {
        idOrder: req.params.idOrder,
      },
    });
    if (!order) return res.status(404).json({ msg: "No Data Found" });
  
    if (!req.files || !req.files.file) return res.status(400).json({ msg: "No file uploaded" });
  
    const file = req.files.file;
    const ext = path.extname(file.name);
    const fileName = `${file.md5}${ext}`;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = [".png", ".jpg", ".jpeg"];
  
    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
  
    file.mv(`./public/images/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
      try {
        await OrderModel.update({
          imagePembayaran: fileName,
          urlPembayaran: url,
        }, {
          where: {
            idOrder: req.params.idOrder,
          }
        });
        res.status(201).json({ msg: "Order berhasil diupdate" });
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
      }
    });
  };

}



const uploadKurir = async (req, res) => {
  const order = await OrderModel.findOne({
    where: {
      idOrder: req.params.idOrder,
    },
  });
  if (!order) return res.status(404).json({ msg: "No Data Found" });

  if (!req.files || !req.files.file) return res.status(400).json({ msg: "No file uploaded" });

  const file = req.files.file;
  const ext = path.extname(file.name);
  const fileName = `${file.md5}${ext}`;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Invalid Images" });

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await OrderModel.update({
        imageKurir: fileName,
        urlKurir: url,
      }, {
        where: {
          idOrder: req.params.idOrder,
        }
      });
      res.status(201).json({ msg: "Order berhasil diupdate" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: error.message });
    }
  });
};


module.exports = {OrderController,
  uploadKurir,
};
