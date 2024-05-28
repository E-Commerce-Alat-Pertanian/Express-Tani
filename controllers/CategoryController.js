const Category = require("../models/CategoryModel")

class CategoriController {
  static allKategori(req, res) {
    Category.findAll()
      .then((data) => {
        res.status(200).json({
          status: true,
          message: "Berhasil mengambil data kategori",
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
}

module.exports = CategoriController