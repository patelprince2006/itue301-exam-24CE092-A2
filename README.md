# QuickBite Food Ordering System

A full-stack food ordering web application developed for the **ITUE301 – Advanced Web Development Frameworks** practical examination at **CSPIT, CHARUSAT**.

QuickBite allows customers to browse restaurants and place food orders through a web interface. The system also provides protected order APIs, authentication, restaurant management data, and an admin panel.

## 👨‍💻 Project Information

* **Course:** ITUE301 – Advanced Web Development Frameworks
* **Examination:** Open-Book Practical Examination
* **Set:** A
* **Project:** QuickBite Food Ordering System
* **Frontend:** React.js
* **Backend:** Express.js / Node.js
* **Database:** MongoDB
* **ODM:** Mongoose

## 🚀 Features

### Customer

* Browse available restaurants
* Search restaurants by name or cuisine
* View restaurant rating and open/closed status
* Login using customer authentication
* Place food orders
* View customer orders
* Protected order page

### Restaurant

* Restaurant information stored in MongoDB
* Restaurant name, cuisine, rating and availability status
* Order data associated with restaurants

### Admin

* Lazy-loaded Admin Panel
* Platform overview
* Restaurant and order information

## 🛠️ Technology Stack

### Frontend

* React.js
* React Router DOM
* React Context API
* JavaScript
* Fetch API
* CSS

### Backend

* Node.js
* Express.js
* REST API
* Middleware
* JWT/Bearer Token Authentication

### Database

* MongoDB
* Mongoose

## 📁 Project Structure

```text
QuickBite/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── RestaurantCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── RestaurantsPage.jsx
│   │   │   ├── OrderPage.jsx
│   │   │   └── AdminPanel.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── backend/
│   ├── models/
│   │   ├── Customer.js
│   │   ├── Restaurant.js
│   │   └── Order.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── restaurantRoutes.js
│   │   └── orderRoutes.js
│   │
│   ├── middleware/
│   │   ├── authGuard.js
│   │   ├── requestLogger.js
│   │   └── errorHandler.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🌐 Frontend Routes

| Route          | Component       | Description                   |
| -------------- | --------------- | ----------------------------- |
| `/`            | HomePage        | QuickBite home page           |
| `/restaurants` | RestaurantsPage | Displays restaurants from API |
| `/order`       | OrderPage       | Protected food ordering page  |
| `/admin`       | AdminPanel      | Lazy-loaded admin panel       |

Navigation is implemented using React Router links without full-page reloads.

## 🔐 Authentication

The application uses an `AuthContext` to maintain:

```javascript
{
  customer,
  token
}
```

The `/order` route is protected using a `ProtectedRoute` component.

Unauthenticated users are redirected to:

```text
/
```

The backend validates the Bearer token through the custom `authGuard` middleware.

## 🍽️ RestaurantCard Component

`RestaurantCard` is a reusable component that accepts:

```javascript
name
cuisine
rating
isOpen
```

It displays all restaurant details.

Restaurant status is displayed as:

```text
isOpen = true  → Open Now
isOpen = false → Closed
```

The restaurant information displayed on the Restaurants page is retrieved from the backend API rather than being hardcoded.

## 📦 Database Collections

The application uses the following MongoDB collections:

```text
Customer
Restaurant
Order
```

### Customer

```text
name
email
phone
address
```

The email field is required and unique.

### Restaurant

```text
name
cuisine
rating
isOpen
```

`isOpen` is a Boolean field with a default value of `true`.

### Order

```text
customerId
restaurantId
items
totalAmount
status
```

References:

```text
customerId → Customer
restaurantId → Restaurant
```

Order status values are:

```text
pending
preparing
out-for-delivery
delivered
cancelled
```

The default status is:

```text
pending
```

## 🔗 REST API Endpoints

Base URL:

```text
http://localhost:5000/api/v1
```

| Method | Endpoint             | Authentication | Purpose                               |
| ------ | -------------------- | -------------- | ------------------------------------- |
| POST   | `/auth/login`        | Public         | Authenticate customer and issue token |
| GET    | `/restaurants`       | Public         | Get all restaurants                   |
| POST   | `/orders`            | Protected      | Create a new order                    |
| GET    | `/orders`            | Protected      | Get logged-in customer's orders       |
| PATCH  | `/orders/:id/status` | Protected      | Update order status                   |

The required API endpoints and their purposes are defined in the examination question paper.

## 🛡️ Middleware

### requestLogger

The `requestLogger` middleware is applied globally and logs every request in the format:

```text
[METHOD] [PATH] [TIMESTAMP]
```

Example:

```text
[GET] /api/v1/restaurants [2026-08-24T10:15:20.000Z]
```

### authGuard

The `authGuard` middleware validates:

```text
Authorization: Bearer TOKEN
```

Missing or invalid authentication returns:

```text
401 Unauthorized
```

### errorHandler

A global error-handling middleware returns structured JSON responses without exposing the raw server error stack.

## 🔎 Restaurant Search

The Restaurants page contains a client-side search feature.

Users can search by:

* Restaurant name
* Cuisine

The search filters the already-fetched restaurant array and does not make another API request.

## ⏳ API Loading and Error Handling

The Restaurants page maintains:

```javascript
restaurants
loading
error
```

While the API request is running:

```text
Loading restaurants...
```

If the request fails:

```text
Failed to load restaurants.
```

After successful loading, restaurants are rendered using `RestaurantCard`.

The API consumption requirements, including `useEffect`, loading/error states, and client-side search, are specified in Task 4 of the examination.

## 🗄️ MongoDB Setup

### 1. Install MongoDB

Install MongoDB locally or use MongoDB Atlas.

### 2. Create `.env`

Inside the `backend` folder, create:

```text
.env
```

Add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

**Do not commit the real `.env` file to GitHub.**

The examination instructions require using environment variables for MongoDB connection details and PORT and require committing `.env.example` instead of the real `.env`.

### 3. Create `.env.example`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## ▶️ How to Run the Backend

Open a terminal:

```bash
cd backend
npm install
```

Start the server:

```bash
node server.js
```

If a start script is configured:

```bash
npm start
```

Backend will run on:

```text
http://localhost:5000
```

The examination requires the backend to start using `node server.js` or `npm start` and to document this in `README.md`.

## ▶️ How to Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Start the React development server:

```bash
npm run dev
```

Open the URL displayed by Vite, usually:

```text
http://localhost:5173
```

## 🧪 API Testing

The REST APIs can be tested using **Postman** or **Thunder Client**.

### Login

```http
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json
```

Example body:

```json
{
  "email": "customer@example.com"
}
```

### Get Restaurants

```http
GET http://localhost:5000/api/v1/restaurants
```

### Create Order

```http
POST http://localhost:5000/api/v1/orders
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

Example:

```json
{
  "restaurantId": "RESTAURANT_ID",
  "items": [
    {
      "name": "Margherita Pizza",
      "quantity": 2
    }
  ],
  "totalAmount": 300
}
```

### Get Customer Orders

```http
GET http://localhost:5000/api/v1/orders
Authorization: Bearer YOUR_TOKEN
```

### Update Order Status

```http
PATCH http://localhost:5000/api/v1/orders/ORDER_ID/status
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

Example:

```json
{
  "status": "preparing"
}
```

## 📊 HTTP Status Codes

| Status | Meaning                           |
| ------ | --------------------------------- |
| `200`  | Successful GET/PATCH request      |
| `201`  | Successful POST request           |
| `400`  | Validation or invalid input error |
| `401`  | Missing or invalid authentication |
| `500`  | Internal server error             |

## ✅ Validation

Mongoose schema validation is implemented for:

* Required fields
* Unique customer email
* Minimum values
* Enum order status
* Required order items
* Minimum `totalAmount` of `0`

Invalid requests return meaningful JSON error responses instead of exposing raw Mongoose errors.

## 📸 Submission Screenshots

The practical examination requires the final report to contain screenshots showing:

1. `RestaurantsPage` rendering live restaurant data
2. Postman/Thunder Client showing `POST /api/v1/orders` returning `201`
3. MongoDB Compass/Atlas showing a saved order document

These three screenshots are specifically listed in the Set A submission requirements.

## 👤 User Roles

The system supports the following roles:

```text
Customer
Restaurant Owner
Admin
```

## 📌 Academic Submission

This project is developed for:

**ITUE301 – Advanced Web Development Frameworks**
**CSPIT, CHARUSAT**
**B.Tech Semester 5 – AY 2026–27**
**Set A – QuickBite Food Ordering System**

The examination specifies a public GitHub repository containing the frontend, backend, README.md and `.env.example`.

---

## ⚠️ Note

This project is intended for academic/practical examination purposes. All submitted code should be understood by the student and explained during the viva, as required by the examination instructions.
