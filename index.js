
const express = require("express");
const cors = require("cors");
<<<<<<< HEAD
require("dotenv").config();
=======
>>>>>>> f32b891442c72627b49becb71c877c978e89778a

const connect = require("./connection");

const book = require("./routes/book");
const mobile = require("./routes/mobile");
const discount = require("./routes/discount");
const user = require("./routes/user");
<<<<<<< HEAD
const getTransactions = require("./routes/PaymentList");
=======

>>>>>>> f32b891442c72627b49becb71c877c978e89778a
const home = require("./routes/user/home");
const frontUser = require("./routes/user/user");

const createAdmin = require("./createAdmin");

<<<<<<< HEAD
// Razorpay Payment Routes
const paymentRoutes = require("./routes/user/Payment");

const app = express();

// ===================================
// MIDDLEWARE
// ===================================

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  process.env.FRONTEND_ORIGIN,
  process.env.ADMIN_ORIGIN,
].filter(Boolean));

// Enable CORS for local frontends and explicitly configured deployments.
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// ===================================
// PAYMENT ROUTES
// ===================================

app.use("/api/payment", paymentRoutes);

// ===================================
// OTHER ROUTES
// ===================================
app.use(getTransactions);
app.use(book);
app.use(discount);
app.use(home);
app.use(frontUser);
app.use(mobile);
app.use(user);

// ===================================
// DATABASE CONNECTION
// ===================================

connect();

// ===================================
// CREATE ADMIN
// ===================================

createAdmin();

// ===================================
// START SERVER
// ===================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
=======
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
>>>>>>> f32b891442c72627b49becb71c877c978e89778a
});
