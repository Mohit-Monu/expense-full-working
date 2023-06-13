const Razorpay = require("razorpay");
const Order = require("../models/order");
const sequelize = require("../database");

async function buymembership(req, res) {
  const t = await sequelize.transaction();
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 25000;
    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        res.status(500).json({ message: "Something went wrong " });
      } else {
        await req.user.createOrder(
          { orderid: order.id, status: "PENDING" },
          { transaction: t }
        );
        await t.commit();
        res.status(201).json({ order, key_id: rzp.key_id });
      }
    });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "Something went wrong " });
  }
}
async function updatetransaction(req, res) {
  const t = await sequelize.transaction();
  try {
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id } });
    await order.update(
      { payment_id: payment_id, status: "Successfull" },
      { transaction: t }
    );

    await req.user.update({ isPremiumUser: true }, { transaction: t });
    await t.commit()
    res.status(202).json({ success: true, message: "Transaction Successful" });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "Something went wrong " });
  }
}
module.exports = { buymembership, updatetransaction };
