const express = require("express");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");

const router = express.Router();

// POST /api/v1/auth/login - Authenticate customer and issue token
router.post("/login", async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required for login",
      });
    }

    // Find customer by email
    const customer = await Customer.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Customer not found. Please register or use sample email.",
      });
    }

    // Generate JWT Bearer token
    const secret = process.env.JWT_SECRET || "quickbite_secret_key";
    const token = jwt.sign(
      {
        id: customer._id.toString(),
        name: customer.name,
        email: customer.email,
      },
      secret,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/register - Helper for registering a new customer
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !email || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, phone, address) are required",
      });
    }

    const existing = await Customer.findOne({
      email: email.trim().toLowerCase(),
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Customer with this email already exists",
      });
    }

    const newCustomer = await Customer.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
    });

    const secret = process.env.JWT_SECRET || "quickbite_secret_key";
    const token = jwt.sign(
      {
        id: newCustomer._id.toString(),
        name: newCustomer.name,
        email: newCustomer.email,
      },
      secret,
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      token,
      customer: {
        id: newCustomer._id,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        address: newCustomer.address,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/admin/login - Authenticate platform administrator
router.post("/admin/login", async (req, res, next) => {
  try {
    const { adminId, password } = req.body;

    if (!adminId || !password) {
      return res.status(400).json({
        success: false,
        message: "Admin ID and Password are required",
      });
    }

    // Default admin credentials for examination
    const validAdminIds = ["admin", "admin@quickbite.com", "admin123"];
    const validPassword = "admin123";

    if (
      validAdminIds.includes(adminId.trim().toLowerCase()) &&
      password.trim() === validPassword
    ) {
      const secret = process.env.JWT_SECRET || "quickbite_secret_key";
      const token = jwt.sign(
        {
          id: "admin_master",
          name: "System Administrator",
          email: "admin@quickbite.com",
          role: "admin",
        },
        secret,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        success: true,
        message: "Admin authenticated successfully",
        token,
        admin: {
          id: "admin_master",
          name: "System Administrator",
          email: "admin@quickbite.com",
          role: "admin",
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid Admin ID or Password. (Hint: admin / admin123)",
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/auth/me - Check current customer profile (optional helper)
router.get("/customers", async (req, res, next) => {
  try {
    const customers = await Customer.find().select("-__v");
    res.status(200).json({ success: true, customers });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
