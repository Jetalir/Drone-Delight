const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();
const PORT = 3001;
const SECRET_KEY = "your_secret_key"; // replace with secure value in production

app.use(cors());
app.use(bodyParser.json());

// Helpers to read/write db.json
const getData = () => JSON.parse(fs.readFileSync("./db.json", "utf-8"));
const saveData = (data) => fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));

// ----- AUTH -----

// Login route
app.post("/login", (req, res) => {
  const { name, password } = req.body;
  const users = getData().users || [];

  const user = users.find(
    (u) => (u.name === name || u.email === name) && u.password === password
  );

  if (user) {
    const token = jwt.sign({ id: user.id, name: user.name }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Protected example route
app.get("/profile", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: "Access granted", user: decoded });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// ----- MENU ITEMS -----

app.get("/menuItems", (req, res) => {
  const data = getData();
  let menuItems = data.menuItems || [];

  if (req.query.isPopular) {
    const isPopular = req.query.isPopular === "true";
    menuItems = menuItems.filter(item => !!item.isPopular === isPopular);
  }

  res.json(menuItems);
});


// ----- CART -----

// Get cart items, optionally filtered by userId
app.get("/cart", (req, res) => {
  const { userId } = req.query;
  const data = getData();
  const cart = data.cart || [];

  if (userId) {
    return res.json(cart.filter(item => String(item.userId) === String(userId)));
  }

  res.json(cart);
});

// Add new cart item
app.post("/cart", (req, res) => {
  const newItem = req.body;
  const data = getData();

  if (!data.cart) data.cart = [];

  // Assign a unique id (you can use timestamp or better ID generator)
  newItem.id = Date.now().toString();

  data.cart.push(newItem);
  saveData(data);

  res.status(201).json(newItem);
});

// Update existing cart item
app.put("/cart/:id", (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;
  const data = getData();

  const cart = data.cart || [];
  const index = cart.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  cart[index] = { ...cart[index], ...updatedItem };
  saveData(data);

  res.json(cart[index]);
});

// Delete cart item
app.delete("/cart/:id", (req, res) => {
  const { id } = req.params;
  const data = getData();

  const cart = data.cart || [];
  const index = cart.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  cart.splice(index, 1);
  saveData(data);

  res.status(204).end();
});


// ----- ORDERS -----

// Get all orders or filter by userId
app.get("/orders", (req, res) => {
  const { userId } = req.query;
  const data = getData();
  const orders = data.orders || [];

  if (userId) {
    return res.json(orders.filter((order) => order.userId == userId));
  }

  res.json(orders);
});

// Create new order
app.post("/orders", (req, res) => {
  const newOrder = req.body;
  const data = getData();

  newOrder.id = Date.now().toString();
  data.orders.push(newOrder);

  saveData(data);
  res.status(201).json(newOrder);
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;
  const data = getData();
  const users = data.users || [];

  const index = users.findIndex(u => String(u.id) === String(id));
  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  if (updatedUser.favoriteItems !== undefined) {
    users[index].favoriteItems = updatedUser.favoriteItems;
  }


  saveData(data);

  res.json(users[index]);
});


// ----- START SERVER -----

app.listen(PORT, () => {
  console.log(`✅ Express server running at http://localhost:${PORT}`);
});
