const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();
const PORT = 5000;
const SECRET_KEY = "your_secret_key"; // 👈 make this secure in real apps

app.use(cors());
app.use(bodyParser.json());

// Read users from db.json
const getUsers = () => {
  const data = JSON.parse(fs.readFileSync("./db.json", "UTF-8"));
  return data.users || [];
};

// Login route
app.post("/login", (req, res) => {
  const { name, password } = req.body;
  const users = getUsers();
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

// Protected route example
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

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
