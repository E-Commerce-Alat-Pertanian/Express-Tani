const Customers = require("../models/CustomerModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { updateUsers } = require("./UserController.js");

const getCustomers = async (req, res) => {
  try {
    const customers = await Customers.findAll({
      attributes: ["id", "username", "email"],
    });
    res.json(customers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

const getProfile = async (req, res) => {
  const id = req.userId;

  try {
    const customer = await Customers.findOne({
      where: { id }
    });

    if (!customer) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: {},
      });
    }

    res.status(200).json({
      status: true,
      message: "Berhasil mengambil profil user",
      data: customer,
    });
  } catch (err) {
    console.log("Error fetching profile:", err);
    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan, silahkan coba lagi",
      data: {},
    });
  }
};


const Register = async (req, res) => {
  const { username, email, noHp, alamat, password, confPassword, idKecamatan } = req.body;

  // if (password !== confPassword) {
  //   return res.status(400).json({ msg: "Password dan Confirm Password Tidak Cocok" });
  // }

  const existingEmail = await Customers.findOne({ where: { email } });
  if (existingEmail) {
    return res.status(409).json({ msg: "Email sudah terdaftar" });
  }

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    const newCustomer = await Customers.create({
      username,
      email,
      noHp,
      alamat,
      password: hashPassword,
      idKecamatan
    });

    const accessToken = jwt.sign(
      { userId: newCustomer.id, username, email, noHp, alamat },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: newCustomer.id, username, email, noHp, alamat },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await Customers.update(
      { refresh_token: refreshToken },
      { where: { id: newCustomer.id } }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      msg: "Register Berhasil",
      data: {
        user: {
          id: newCustomer.id,
          username: newCustomer.username,
          email: newCustomer.email,
          noHp: newCustomer.noHp,
          alamat: newCustomer.alamat,
          idKecamatan: newCustomer.idKecamatan,
        },
        token: accessToken
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

const Login = async (req, res) => {
  try {
    const customer = await Customers.findOne({
      where: { email: req.body.email },
    });

    if (!customer) return res.status(404).json({ msg: "Email tidak ditemukan" });

    const match = await bcrypt.compare(req.body.password, customer.password);
    if (!match) return res.status(400).json({ msg: "Password Salah" });

    const accessToken = jwt.sign(
      { userId: customer.id, username: customer.username, email: customer.email, noHp: customer.noHp, alamat: customer.alamat },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { userId: customer.id, username: customer.username, email: customer.email, noHp: customer.noHp, alamat: customer.alamat },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await Customers.update({ refresh_token: refreshToken }, {
      where: { id: customer.id }
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: true,
      message: "Berhasil login",
      data: { user: customer, accessToken },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan, silahkan coba lagi",
      data: {},
    });
  }
};

const updateProfile = async (req, res) => {
  const id = req.userId;

  try {
    const customer = await Customers.findOne({
      where: { id }
    });

    if (!customer) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { username, email } = req.body;

    customer.username = username || customer.username;
    customer.email = email || customer.email;
    // customer.alamat = alamat || customer.alamat;
    // customer.idKecamatan = idKecamatan || customer.idKecamatan;

    await customer.save();

    res.status(200).json({ data: customer });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan, silahkan coba lagi', error: error.message });
  }
};

const updateAddress = async (req, res) => {
  const id = req.userId;

  try {
    const customer = await Customers.findOne({
      where: { id }
    });

    if (!customer) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { noHp, alamat, idKecamatan} = req.body;

    // customer.username = username || customer.username;
    // customer.email = email || customer.email;
    customer.noHp = noHp || customer.noHp;
    customer.alamat = alamat || customer.alamat;
    customer.idKecamatan = idKecamatan || customer.idKecamatan;

    await customer.save();

    res.status(200).json({ data: customer });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan, silahkan coba lagi', error: error.message });
  }
};

const Logout = async (req, res) => {
  const id = req.userId

    Customers.update({ refresh_token: null }, {
      where: { id }
    })
      .then((_) => {
        res.status(200).json({
          status: true,
          message: "Berhasil logout",
          data: {},
        })
      })
      .catch((error) => {
        console.log(error)
        res.status(500).json({
          status: false,
          message: "Terjadi kesalahan, silahkan coba lagi",
          data: {},
        })
      })
  }


module.exports = {
  getCustomers,
  getProfile,
  updateProfile,
  updateAddress,
  Register,
  Login,
  Logout
};
