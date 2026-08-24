const mongoose = require("mongoose");
require("dotenv").config();

const Customer = require("./models/Customer");
const Restaurant = require("./models/Restaurant");
const Order = require("./models/Order");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quickbite";

const seedDatabase = async () => {
  try {
    console.log("[Seeder] Connecting to MongoDB:", MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log("[Seeder] Connected successfully.");

    // Clear existing collections
    await Customer.deleteMany({});
    await Restaurant.deleteMany({});
    await Order.deleteMany({});
    console.log("[Seeder] Cleared previous data.");

    // 1. Seed Restaurants (At least 5 required)
    const sampleRestaurants = [
      {
        name: "Pizza Palace",
        cuisine: "Italian",
        rating: 4.5,
        isOpen: true,
      },
      {
        name: "Burger Hub",
        cuisine: "American Fast Food",
        rating: 4.2,
        isOpen: true,
      },
      {
        name: "Spice Garden",
        cuisine: "North Indian",
        rating: 4.8,
        isOpen: false,
      },
      {
        name: "Food Corner",
        cuisine: "Chinese & Asian",
        rating: 3.9,
        isOpen: true,
      },
      {
        name: "South Indian Express",
        cuisine: "South Indian",
        rating: 4.6,
        isOpen: true,
      },
      {
        name: "Taco Fiesta",
        cuisine: "Mexican",
        rating: 4.4,
        isOpen: false,
      },
    ];

    const insertedRestaurants = await Restaurant.insertMany(sampleRestaurants);
    console.log(`[Seeder] Seeded ${insertedRestaurants.length} restaurants.`);

    // 2. Seed Customer
    const sampleCustomer = await Customer.create({
      name: "John Doe",
      email: "customer@example.com",
      phone: "9876543210",
      address: "123 Food Street, Navrangpura, Ahmedabad",
    });
    console.log(`[Seeder] Seeded customer: ${sampleCustomer.email}`);

    // 3. Seed Sample Order
    await Order.create({
      customerId: sampleCustomer._id,
      restaurantId: insertedRestaurants[0]._id,
      items: [
        { name: "Margherita Pizza", quantity: 2, price: 299 },
        { name: "Garlic Bread", quantity: 1, price: 149 },
      ],
      totalAmount: 747,
      deliveryAddress: sampleCustomer.address,
      status: "pending",
    });
    console.log("[Seeder] Seeded sample order.");

    console.log("[Seeder] Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("[Seeder] Error during seeding:", error);
    process.exit(1);
  }
};

seedDatabase();
