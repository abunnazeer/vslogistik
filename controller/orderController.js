const Order = require("../models/order");

router.post("/order/place", async (req, res) => {
  try {
    const order = new Order({
      productDetails: req.body.productDetails,
      user: req.body.userId,
    });

    await order.save();

    res.status(201).json({ msg: "Order placed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
