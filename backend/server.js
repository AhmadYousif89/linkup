import express from "express";
import dotenv from "dotenv";

// Setup the server
const app = express();
dotenv.config();

// get port from env, or use 5000 as default
const port = process.env.PORT || 5000;

// Main page to be changed
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Confirm start to the console
app.listen(port, console.log(`Server listening on port ${port}`));
