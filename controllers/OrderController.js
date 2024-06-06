const OrderModel = require("../models/OrderModel");
const StokModel = require("../models/stok_model");
const KeranjangController = require("../controllers/keranjang_controller");
const Customers = require("../models/CustomerModel");
const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");

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
}


module.exports = OrderController;
