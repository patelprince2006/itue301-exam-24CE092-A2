const express = require("express");
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const authGuard = require("../middleware/authGuard");

const router = express.Router();

const VALID_STATUSES = [
  "pending",
  "preparing",
  "out-for-delivery",
  "out-fordelivery",
  "delivered",
  "cancelled",
];

// GET /api/v1/orders/admin/all - Return all orders for admin overview
router.get("/admin/all", authGuard, async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("customerId", "name email phone address")
      .populate("restaurantId", "name cuisine rating")
      .sort({ createdAt: -1 });

    const totalRestaurants = await Restaurant.countDocuments();
    const totalOrders = orders.length;

    res.status(200).json({
      success: true,
      totalOrders,
      totalRestaurants,
      orders,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/orders - Return logged-in customer's orders
router.get("/", authGuard, async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const orders = await Order.find({ customerId })
      .populate("customerId", "name email")
      .populate("restaurantId", "name cuisine")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/orders - Create new order
router.post("/", authGuard, async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const { restaurantId, items, totalAmount, deliveryAddress } = req.body;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: "restaurantId is required",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "items must be a non-empty array",
      });
    }

    if (totalAmount === undefined || totalAmount === null || Number(totalAmount) < 0) {
      return res.status(400).json({
        success: false,
        message: "totalAmount is required and must be >= 0",
      });
    }

    // Verify restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const newOrder = await Order.create({
      customerId,
      restaurantId,
      items,
      totalAmount: Number(totalAmount),
      deliveryAddress: deliveryAddress || "",
      status: "pending",
    });

    const populatedOrder = await Order.findById(newOrder._id)
      .populate("customerId", "name email phone address")
      .populate("restaurantId", "name cuisine rating");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/orders/:id/status - Update order status
router.patch("/:id/status", authGuard, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate("customerId", "name email phone address")
      .populate("restaurantId", "name cuisine rating");

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
