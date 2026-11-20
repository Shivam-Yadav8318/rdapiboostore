
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const connect = require("./connection");

const book = require("./routes/book");
const mobile = require("./routes/mobile");
const discount = require("./routes/discount");
const user = require("./routes/user");

const getTransactions = require("./routes/PaymentList");
const home = require("./routes/user/home");
const frontUser = require("./routes/user/user");

const createAdmin = require("./createAdmin");

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
// HOME ROUTE
// ===================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Bookstore API is running",
  });
});

// ===================================
// DATABASE CONNECTION
// ===================================

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {

    await connect();

    // ===================================
    // CREATE ADMIN
    // ===================================

    await createAdmin();

    // ===================================
    // START SERVER
    // ===================================

    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });

  } catch (error) {
    console.log("Server Error:", error);
    process.exit(1);
  }
}

startServer();
