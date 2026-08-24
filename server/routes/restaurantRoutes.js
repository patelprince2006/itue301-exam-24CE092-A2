const express = require("express");
const Restaurant = require("../models/Restaurant");

const router = express.Router();

// GET /api/v1/restaurants - Public: Return all restaurants
router.get("/", async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/restaurants/:id - Public: Get single restaurant details
router.get("/:id", async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }
    res.status(200).json({
      success: true,
      restaurant,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/restaurants - Create new restaurant
router.post("/", async (req, res, next) => {
  try {
    const { name, cuisine, rating, isOpen } = req.body;

    if (!name || !cuisine || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, cuisine, and rating are required",
      });
    }

    const restaurant = await Restaurant.create({
      name: name.trim(),
      cuisine: cuisine.trim(),
      rating: Number(rating),
      isOpen: isOpen !== undefined ? Boolean(isOpen) : true,
    });

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      restaurant,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
