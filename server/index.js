const cors = require("cors");
const express = require("express");
const app = express();
const PORT = 5000;
const mongoose = require("mongoose");
const User = require("../server/models/user_model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/mern-project");

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.json({ status: "ok" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ status: "error", error: "Email is already registered" });
    } else {
      console.error(error);
      res.status(500).json({ status: "error", error: "Internal Server Error" });
    }
  }
});
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ name: user.name, email: user.email }, "secret123");
    res.json({ status: "ok", user: token });
  } else {
    res.status(401).json({ status: "error", user: false });
  }
});
app.get("/api/quote", async (req, res) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({ status: "error", error: "Token required" });
  }

  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }
    // Send both the quote and the name of the user in the response
    res.json({ status: "ok", quote: user.quote, name: user.name });
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "error", error: "Invalid token" });
  }
});

app.post("/api/quote", async (req, res) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({ status: "error", error: "Token required" });
  }

  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;
    const user = await User.updateOne(
      { email: email },
      { $set: { quote: req.body.quote } }
    );

    if (user.modifiedCount === 0) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }

    res.json({ status: "ok", message: "Quote updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(401).json({ status: "error", error: "Invalid token" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
