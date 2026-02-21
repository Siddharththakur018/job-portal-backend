require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();
const authRoutes = require("./routes/authRoutes");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use(session({
    name: "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.default.create({
        mongoUrl: process.env.MONGO_URL,
        collectionName: "sessions",
         crypto: {
            secret: process.env.SESSION_SECRET
        }
    }),
    cookie:{
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}))

app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
