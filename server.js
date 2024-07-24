const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoute = require("./router/auth");
const userRoute = require("./router/user");
const commentRoute = require("./router/comment");
const recipeRoute = require("./router/recipe");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/comment", commentRoute);
app.use("/recipe", recipeRoute);
