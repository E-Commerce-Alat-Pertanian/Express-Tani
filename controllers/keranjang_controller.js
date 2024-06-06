const KeranjangModel = require("../models/CartModel");
const StokModel = require("../models/stok_model");

class KeranjangController {
  static keranjangRiwayatByUser(req, res) {
    const userId = req.userId;

    KeranjangModel.findAll({
      include: [
        {
          association: "stok",
        },
        {
          association: "product",
        },
      ],
      where: { userId, idOrder: null },
    })
      .then((data) => {
        res.status(200).json({
          status: true,
          message: "Berhasil mengambil data keranjang",
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
  }

  static async updateKeranjang(req, res) {
    try {
      const userId = req.userId;
      const listKeranjang = req.body;

      await KeranjangController.updateKeranjangLocal(listKeranjang, userId);

      res.status(200).json({
        status: true,
        message: "Berhasil update keranjang",
        data: {},
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Terjadi kesalahan saat mengupdate keranjang",
        data: {},
      });
    }
  }

  static async updateKeranjangLocal(listKeranjangRaw, userId) {
    try {
      const listKeranjang = listKeranjangRaw.map(keranjang => {
        keranjang.userId = userId;
        return keranjang;
      });
  
      const keranjangBaru = listKeranjang.filter(keranjang => keranjang.id === null);
      const KeranjangLama = listKeranjang.filter(keranjang => keranjang.id !== null);
  
      await KeranjangModel.bulkCreate(keranjangBaru).catch((err) => console.log(err));
  
      const promises = KeranjangLama.map(keranjang => {
        return KeranjangModel.update(keranjang, {
          where: { idCart: keranjang.id }
        });
      });
      await Promise.allSettled(promises);
  
    } catch (error) {
      throw error;
    }
  }

  static async hapusKeranjang(req, res) {
    const idCart = req.params.idCart;
    try {
      const result = await KeranjangModel.destroy({
        where: {
          idCart: idCart,
        },
      });
      if (result) {
        res.status(200).json({
          status: true,
          message: "Item berhasil dihapus dari keranjang",
          data: {},
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Item tidak ditemukan di keranjang",
          data: {},
        });
      }
    } catch (error) {
      console.log("Error while deleting cart item:", error);
      res.status(500).json({
        status: false,
        message: "Terjadi kesalahan saat menghapus item dari keranjang",
        data: {},
      });
    }
  }
}

module.exports = KeranjangController;
