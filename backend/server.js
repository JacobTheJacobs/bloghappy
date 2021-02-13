const express = require("express");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
//import routes

const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const adminRoutes = require("./routes/admin");

//app
const app = express();

//middleware
app.use(bodyparser.json());
app.use(cookieParser());

//dbs
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"));
//routes middleware

//corsss

if (process.env.NODE_ENV === "development") {
  app.use(cors(`${process.env.CLIENT_URL}`));
}

app.use(authRoutes);
app.use(categoryRoutes);
app.use(adminRoutes);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "frontend", "build")));
  //app.use(cors(`${process.env.PPRODUCTION_URL}`));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
  });
}
//port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(` is running on port ${port}`);
});
