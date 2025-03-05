require("dotenv").config(); 

const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/adminRoutes");
const storeRoutes = require("./routes/store"); 
const listEndpoints = require("express-list-endpoints");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stores", storeRoutes); 


// Connect to Database
db.sync()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Error connecting to database:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

console.log(listEndpoints(app));




