const KeranjangModel = require("../models/CartModel")

class KeranjangController {
  static keranjangRiwayatByUser(req, res) {
    const userId = req.userId

    KeranjangModel.findAll({
      include: [
        {
            association: "stok",
          },
        {
        association: "product",
        
      }],
      where: { userId, idOrder: null }
    })
      .then((data) => {
        res.status(200).json({
          status: true,
          message: "Berhasil mengambil data keranjang",
          data: data,
        })
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json({
          status: false,
          message: "Terjadi kesalahan, silahkan coba lagi",
          data: {},
        })
      })
    }

    static async
    static async updateKeranjang(req, res) {
      try {
        const userId = req.userId;
        const listKeranjang = req.body;
        
        // Panggil fungsi updateKeranjangLocal dan simpan hasilnya
        await KeranjangController.updateKeranjangLocal(listKeranjang, userId);
    
        // Kirim respons setelah pembaruan selesai
        res.status(200).json({
          status: true,
          message: "Berhasil update keranjang",
          data: {}, // Gunakan data yang diperbarui dari updateKeranjangLocal
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
        const promises = listKeranjangRaw.map(async (keranjang) => {
          try {
            keranjang.userId = userId;
            if (keranjang.idCart === null || keranjang.idCart === undefined) {
              // Jika idCart null atau undefined, tambahkan data baru
              await KeranjangModel.create(keranjang);
            } else {
              // Jika idCart tidak null, update data yang sudah ada
              await KeranjangModel.update(keranjang, {
                where: { idCart: keranjang.idCart }
              });
            }
          } catch (error) {
            console.log("Error while updating/creating cart item:", error);
          }
        });
    
        // Tunggu semua proses selesai
        await Promise.all(promises);
      } catch (error) {
        throw error;
      }
    }

    static async hapusKeranjangIdOrderNull() {
      try {
        await KeranjangModel.destroy({
          where: {
            idOrder: null
          }
        });
        console.log("Keranjang dengan idOrder null berhasil dihapus.");
      } catch (error) {
        console.log("Terjadi kesalahan saat menghapus keranjang dengan idOrder null:", error);
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

module.exports = KeranjangController
