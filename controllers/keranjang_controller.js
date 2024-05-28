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
        association: "product"
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
// KeranjangController.js
static async updateKeranjang(req, res) {
  try {
    const userId = req.userId;
    const listKeranjang = req.body;
    
    // Panggil fungsi updateKeranjangLocal dan simpan hasilnya
    const updatedKeranjang = await KeranjangController.updateKeranjangLocal(listKeranjang, userId);

    // Kirim respons setelah pembaruan selesai
    res.status(200).json({
      status: true,
      message: "Berhasil update keranjang",
      data: updatedKeranjang, // Gunakan data yang diperbarui dari updateKeranjangLocal
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

// KeranjangController.js
static async updateKeranjangLocal(listKeranjangRaw, userId) {
  try {
    const listKeranjang = listKeranjangRaw.map(keranjang => {
      keranjang.userId = userId;
      return keranjang;
    });

    const keranjangBaru = listKeranjang.filter(keranjang => keranjang.id === null);
    const keranjangLama = listKeranjang.filter(keranjang => keranjang.id !== null);

    await Promise.all([
      KeranjangModel.bulkCreate(keranjangBaru),
      // Ubah iterasi update menjadi Promise.all
      ...keranjangLama.map(keranjang => KeranjangModel.update(keranjang, {
        where: { id: keranjang.id }
      }))
    ]);
    
    // Jika tidak ada kesalahan, kembalikan data yang diperbarui
    return listKeranjang;

  } catch (error) {
    throw error;
  }
}

}


module.exports = KeranjangController
