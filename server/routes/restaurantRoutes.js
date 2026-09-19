const express = require("express");
const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");
const inMemoryStore = require("../services/inMemoryStore");

const router = express.Router();

// GET /api/v1/restaurants - Public: Return all restaurants
router.get("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const restaurants = await Restaurant.find().sort({ createdAt: -1 });
      if (restaurants && restaurants.length > 0) {
        return res.status(200).json({
          success: true,
          count: restaurants.length,
          restaurants,
        });
      }
    }
    const fallbackRestaurants = inMemoryStore.getRestaurants();
    return res.status(200).json({
      success: true,
      count: fallbackRestaurants.length,
      restaurants: fallbackRestaurants,
    });
  } catch (error) {
    const fallbackRestaurants = inMemoryStore.getRestaurants();
    return res.status(200).json({
      success: true,
      count: fallbackRestaurants.length,
      restaurants: fallbackRestaurants,
    });
  }
});

// GET /api/v1/restaurants/:id - Public: Get single restaurant details
router.get("/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const restaurant = await Restaurant.findById(req.params.id);
      if (restaurant) {
        return res.status(200).json({
          success: true,
          restaurant,
        });
      }
    }
    const fallback = inMemoryStore.getRestaurantById(req.params.id);
    if (fallback) {
      return res.status(200).json({
        success: true,
        restaurant: fallback,
      });
    }
    return res.status(404).json({
      success: false,
      message: "Restaurant not found",
    });
  } catch (error) {
    const fallback = inMemoryStore.getRestaurantById(req.params.id);
    if (fallback) {
      return res.status(200).json({
        success: true,
        restaurant: fallback,
      });
    }
    return res.status(404).json({
      success: false,
      message: "Restaurant not found",
    });
  }
});

// POST /api/v1/restaurants - Create new restaurant
router.post("/", async (req, res) => {
  try {
    const { name, cuisine, rating, isOpen } = req.body;

    if (!name || !cuisine || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, cuisine, and rating are required",
      });
    }

    if (mongoose.connection.readyState === 1) {
      const restaurant = await Restaurant.create({
        name: name.trim(),
        cuisine: cuisine.trim(),
        rating: Number(rating),
        isOpen: isOpen !== undefined ? Boolean(isOpen) : true,
      });

      return res.status(201).json({
        success: true,
        message: "Restaurant created successfully",
        restaurant,
      });
    }

    const fallback = inMemoryStore.createRestaurant({ name, cuisine, rating, isOpen });
    return res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      restaurant: fallback,
    });
  } catch (error) {
    const fallback = inMemoryStore.createRestaurant(req.body);
    return res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      restaurant: fallback,
    });
  }
});

module.exports = router;
