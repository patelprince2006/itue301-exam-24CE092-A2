const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      minlength: 10,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      minlength: 5,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "Customer",
  }
);

const Customer = mongoose.model("Customer", customerSchema, "Customer");

module.exports = Customer;
