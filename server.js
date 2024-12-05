import express from "express";
import mysql from "mysql2";
import path from "path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
dotenv.config();


const __fileURLToPath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileURLToPath);

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Database connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT
});

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to the database.");
});

// Routes
// Create a new task
app.post("/tasks", (req, res) => {
  const { title, status, description } = req.body;
  const query = "INSERT INTO task (title, status, description) VALUES (?, ?, ?)";
  connection.query(query, [title, status, description], (err, results) => {
    if (err) {
      console.error("Error creating task:", err);
      return res.status(500).json({ error: "Failed to create task." });
    }
    res.status(201).json({ id: results.insertId });
  });
});

// Update task status
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const query = "UPDATE task SET status = ? WHERE id = ?";
  connection.query(query, [status, id], (err, results) => {
    if (err) {
      console.error("Error updating task:", err);
      return res.status(500).json({ error: "Failed to update task." });
    }
    res.json({ message: "Task updated successfully." });
  });
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM task WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting task:", err);
      return res.status(500).json({ error: "Failed to delete task." });
    }
    res.json({ message: "Task deleted successfully." });
  });
});

// Start server
app.listen(3000, "127.0.0.1", () => {
  console.log("Listening on http://127.0.0.1:3000");
});
