const UserModel = require("../models/CustomerModel");
const { rajaOngkirKey, idKecamatanToko, beratPaket } = require("../utils/constants");

class DaerahController {
  static async allProvinsi(req, res) {
    try {
      const response = await fetch("https://api.rajaongkir.com/starter/province", {
        headers: { key: rajaOngkirKey },
      });
      
      const data = await response.json();
      if (response.status !== 200) {
        console.log(data);
        throw new Error("Error raja ongkir");
      }
      const results = data.rajaongkir.results;
      
      res.status(200).json({
        status: true,
        message: "Berhasil mengambil data provinsi",
        data: results,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silahkan coba lagi",
        data: [],
      });
    }
  }

  static async kecamatanByProvinsi(req, res) {
    try {
      const { provinsi } = req.params;
      const response = await fetch(`https://api.rajaongkir.com/starter/city?province=${provinsi}`, {
        headers: { key: rajaOngkirKey },
      });

      const data = await response.json();
      if (response.status !== 200) {
        console.log(data);
        throw new Error("Error raja ongkir");
      }
      const results = await data.rajaongkir.results;
      
      res.status(200).json({
        status: true,
        message: "Berhasil mengambil data kecamatan",
        data: results,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silahkan coba lagi",
        data: [],
      });
    }
  }

  static async getKecamatanById(req, res) {
    try {
      const { idKecamatan } = req.params;
      const response = await fetch(`https://api.rajaongkir.com/starter/city?id=${idKecamatan}`, {
        headers: { key: rajaOngkirKey },
      });

      const data = await response.json();
      if (response.status !== 200) {
        console.log(data);
        throw new Error("Error raja ongkir");
      }
      const result = data.rajaongkir.results;
      
      res.status(200).json({
        status: true,
        message: "Berhasil mengambil data kecamatan",
        data: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silahkan coba lagi",
        data: [],
      });
    }
  }

  static async getProvinsiById(req, res) {
    try {
      const { idProvinsi } = req.params;
      const response = await fetch(`https://api.rajaongkir.com/starter/province?id=${idProvinsi}`, {
        headers: { key: rajaOngkirKey },
      });

      const data = await response.json();
      if (response.status !== 200) {
        console.log(data);
        throw new Error("Error raja ongkir");
      }
      const result = data.rajaongkir.results;
      
      res.status(200).json({
        status: true,
        message: "Berhasil mengambil data provinsi",
        data: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silahkan coba lagi",
        data: [],
      });
    }
  }

  static async ongkir(req, res) {
    try {
      const id = req.userId;
      const { kurir } = req.params;

      const user = await UserModel.findByPk(id).catch((err) => {
        console.log(err);
        res.status(401).json({
          status: false,
          message: "Anda belum login",
          data: {}
        });
        return;
      });

      const response = await fetch(`https://api.rajaongkir.com/starter/cost`, {
        method: "POST",
        headers: {
          "key": rajaOngkirKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: idKecamatanToko,
          destination: user.idKecamatan,
          weight: beratPaket,
          courier: kurir,
        })
      });

      const data = await response.json();
      if (response.status !== 200) {
        console.log(data);
        throw new Error("Error raja ongkir");
      }
      
      const result = data.rajaongkir.results[0];
      const cost = result.costs[0].cost[0];
      const ongkir = cost.value;
      
      res.status(200).json({
        status: true,
        message: "Berhasil mengambil data ongkir",
        data: { ongkir },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silahkan coba lagi",
        data: [],
      });
    }
  }
}

module.exports = DaerahController;
