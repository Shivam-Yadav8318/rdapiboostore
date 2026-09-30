
const express = require("express");
const cors = require("cors");

const connect = require("./connection");

const book = require("./routes/book");
const mobile = require("./routes/mobile");
const discount = require("./routes/discount");
const user = require("./routes/user");

const home = require("./routes/user/home");
const frontUser = require("./routes/user/user");

const createAdmin = require("./createAdmin");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(book);
app.use(discount);

app.use(home);
app.use(frontUser);

app.use(mobile);
app.use(user);

// Database connection
connect();

// Create admin
createAdmin();

// Start server
const PORT = 3000;

app.listen(PORT, (err) => {
  if (err) {
    console.log("Server Error:", err);
  } else {
    console.log(`Server is running on ${PORT}..`);
  }
});
