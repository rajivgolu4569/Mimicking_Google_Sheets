const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev")); // Logging requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/google_sheets_clone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "❌ MongoDB connection error:"));

// Spreadsheet Schema with Timestamps
const SheetSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  data: { type: [[String]], required: true }, // 2D array to store spreadsheet data
}, { timestamps: true });

const Sheet = mongoose.model("Sheet", SheetSchema);

// Health Check Route
app.get("/health", (req, res) => {
  res.json({ status: "✅ Server is running", timestamp: new Date() });
});

app.post("/save", async (req, res, next) => {
    try {
      console.log("📥 Incoming Save Request:", req.body);
  
      const { name, data } = req.body;
      if (!name || !Array.isArray(data) || !data.every(row => Array.isArray(row))) {
        console.error("❌ Invalid Data Format");
        return res.status(400).json({ message: "Invalid input: name and 2D data array are required" });
      }
  
      const sheet = await Sheet.findOneAndUpdate(
        { name },
        { data },
        { upsert: true, new: true }
      );
  
      console.log("✅ Spreadsheet Saved:", sheet);
      res.json({ message: "✅ Spreadsheet saved successfully", sheet });
    } catch (error) {
      console.error("❌ Error Saving Data:", error);
      next(error);
    }
  });
  

// Load a spreadsheet
app.get("/load/:name", async (req, res, next) => {
  try {
    const sheet = await Sheet.findOne({ name: req.params.name });
    if (!sheet) return res.status(404).json({ message: "❌ Spreadsheet not found" });
    res.json({ name: sheet.name, data: sheet.data });
  } catch (error) {
    next(error);
  }
});

// List all saved spreadsheets
app.get("/sheets", async (req, res, next) => {
  try {
    const sheets = await Sheet.find({}, "name createdAt updatedAt");
    res.json(sheets);
  } catch (error) {
    next(error);
  }
});

// Delete a spreadsheet
app.delete("/delete/:name", async (req, res, next) => {
  try {
    const result = await Sheet.findOneAndDelete({ name: req.params.name });
    if (!result) return res.status(404).json({ message: "❌ Spreadsheet not found" });
    res.json({ message: "🗑️ Spreadsheet deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// Clear spreadsheet data
app.put("/clear/:name", async (req, res, next) => {
  try {
    const sheet = await Sheet.findOneAndUpdate(
      { name: req.params.name },
      { data: [] },
      { new: true }
    );
    if (!sheet) return res.status(404).json({ message: "❌ Spreadsheet not found" });
    res.json({ message: "🔄 Spreadsheet cleared", sheet });
  } catch (error) {
    next(error);
  }
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
