// In-Memory Fallback Data Store for QuickBite
// Ensures 100% operational uptime on Render even if external MongoDB Atlas is unreachable.

const initialRestaurants = [
  { _id: "66b1a1000000000000000001", name: "Pizza Palace", cuisine: "Italian", rating: 4.5, isOpen: true },
  { _id: "66b1a1000000000000000002", name: "Burger Hub", cuisine: "American Fast Food", rating: 4.2, isOpen: true },
  { _id: "66b1a1000000000000000003", name: "Spice Garden", cuisine: "North Indian", rating: 4.8, isOpen: false },
  { _id: "66b1a1000000000000000004", name: "Food Corner", cuisine: "Chinese & Asian", rating: 3.9, isOpen: true },
  { _id: "66b1a1000000000000000005", name: "South Indian Express", cuisine: "South Indian", rating: 4.6, isOpen: true },
  { _id: "66b1a1000000000000000006", name: "Taco Fiesta", cuisine: "Mexican", rating: 4.4, isOpen: false },
];

const initialCustomer = {
  _id: "66b1a2000000000000000001",
  name: "John Doe",
  email: "customer@example.com",
  phone: "9876543210",
  address: "123 Food Street, Navrangpura, Ahmedabad",
};

const initialOrders = [
  {
    _id: "66b1a3000000000000000001",
    customerId: initialCustomer,
    restaurantId: initialRestaurants[0],
    items: [
      { name: "Margherita Pizza", quantity: 2, price: 299 },
      { name: "Garlic Bread", quantity: 1, price: 149 },
    ],
    totalAmount: 747,
    deliveryAddress: initialCustomer.address,
    status: "pending",
    createdAt: new Date().toISOString(),
  },
];

class InMemoryStore {
  constructor() {
    this.restaurants = [...initialRestaurants];
    this.customers = [{ ...initialCustomer }];
    this.orders = [...initialOrders];
  }

  // Restaurant methods
  getRestaurants() {
    return this.restaurants;
  }

  getRestaurantById(id) {
    return this.restaurants.find((r) => r._id === id || String(r._id) === String(id));
  }

  createRestaurant(data) {
    const newRestaurant = {
      _id: `r_${Date.now()}`,
      name: data.name,
      cuisine: data.cuisine,
      rating: Number(data.rating),
      isOpen: data.isOpen !== undefined ? Boolean(data.isOpen) : true,
      createdAt: new Date().toISOString(),
    };
    this.restaurants.unshift(newRestaurant);
    return newRestaurant;
  }

  // Customer methods
  findCustomerByEmail(email) {
    const cleanEmail = String(email).trim().toLowerCase();
    return this.customers.find((c) => c.email.toLowerCase() === cleanEmail);
  }

  createCustomer(data) {
    const newCustomer = {
      _id: `c_${Date.now()}`,
      name: data.name,
      email: String(data.email).trim().toLowerCase(),
      phone: data.phone,
      address: data.address,
      createdAt: new Date().toISOString(),
    };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  // Order methods
  getOrdersForCustomer(customerId) {
    return this.orders.filter(
      (o) =>
        (o.customerId && o.customerId._id === customerId) ||
        String(o.customerId) === String(customerId)
    );
  }

  getAllOrders() {
    return this.orders;
  }

  createOrder({ customerId, restaurantId, items, totalAmount, deliveryAddress }) {
    const customer =
      this.customers.find((c) => String(c._id) === String(customerId)) || initialCustomer;
    const restaurant =
      this.restaurants.find((r) => String(r._id) === String(restaurantId)) || initialRestaurants[0];

    const newOrder = {
      _id: `o_${Date.now()}`,
      customerId: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      },
      restaurantId: {
        _id: restaurant._id,
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating,
      },
      items,
      totalAmount: Number(totalAmount),
      deliveryAddress: deliveryAddress || customer.address,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);
    return newOrder;
  }

  updateOrderStatus(id, status) {
    const order = this.orders.find((o) => String(o._id) === String(id));
    if (order) {
      order.status = status;
      return order;
    }
    return null;
  }
}

const store = new InMemoryStore();
module.exports = store;
