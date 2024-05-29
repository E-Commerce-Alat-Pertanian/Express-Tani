const KeranjangModel = require("../models/CartModel");
const OrderModel = require("../models/OrderModel");
const StokModel = require("../models/stok_model");
const KeranjangController = require("./keranjang_controller");

class OrderController {
  static async createOrder(req, res) {
    const order = req.body.order;
    const listKeranjangRaw = req.body.keranjang;
    const userId = req.userId;

    // Atur status order jika metode bayar adalah COD
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
          where: { id: keranjang.idStok },
        });
      });

      await Promise.allSettled(promises);

      // Perbarui entri keranjang di database
      await KeranjangController.updateKeranjangLocal(listKeranjang, userId);

      res.status(201).json({
        status: true,
        message: "Berhasil membuat order",
        data: newOrder, // Data order yang baru dibuat
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
