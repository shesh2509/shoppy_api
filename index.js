const express = require("express")
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")
const stripeRoute = require("./routes/stripe")
const cors = require("cors");
const Razorpay= require('razorpay');

dotenv.config();



mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB Connection Successfull!"))
.catch((err) => {
    console.log(err);
})

app.use(express.json());
const logger = require("morgan");
app.use(logger("tiny"));
app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use('/payment', require('./routes/stripe'));

app.use("/", (req,res) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.send("API is Running...");
});

// app.use("/api/checkout", stripeRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running...")
})
