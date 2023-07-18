// const router = require("express").Router();
// // const stripe = require("stripe")(process.env.STRIPE_KEY);
// const KEY = process.env.STRIPE_KEY
// const stripe = require("stripe")(KEY);

// router.post("/payment", (req, res) => {
//   stripe.charges.create(
//     {
//       source: req.body.tokenId,
//       amount: req.body.amount,
//       currency: "usd",
//     },
//     (stripeErr, stripeRes) => {
//       if (stripeErr) {
//         res.status(500).json(stripeErr);
//       } else {
//         res.status(200).json(stripeRes);
//       }
//     }
//   );
// });

require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const crypto = require("crypto");

router.post("/orders", async (req, res) => {
    try {

      //  const addtocart = await orderModel.findOne({userId:});
      //  const sum =0;
      //  addtocart.forEach((elem)=>{
      //   sum+= elem.
      //  })
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        const options = {
            amount: 5000 * 100, // amount in smallest currency unit
            currency: "INR",
            receipt: "receipt_order_74394",
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
         res.status(500).send(error);
    }
});

router.post("/success", async (req, res) => {
  try {
      // getting the details back from our font-end
      const {
          orderCreationId,
          razorpayPaymentId,
          razorpayOrderId,
          razorpaySignature,
      } = req.body;

      let body = `${orderCreationId}|${razorpayPaymentId}`
      // Creating our own digest
      // The format should be like this:
      const shasum = crypto.createHmac('sha256', 'C7z9V4mfABxPliUqDCRiNvKX').update(body.toString())
      .digest('hex');
  
      // comaparing our digest with the actual signature
      if (shasum !== razorpaySignature)
          return res.status(400).json({ msg: "Transaction not legit!" });

      // THE PAYMENT IS LEGIT & VERIFIED
      // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

      res.json({
          msg: "success",
          orderId: razorpayOrderId,
          paymentId: razorpayPaymentId,
      });
 
    //   res.status(200).send("sucess")
  } catch (error) {
      res.status(500).send(error);
  }
});

module.exports = router;