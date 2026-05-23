const { createPayment } = require("../services/paymentService");

exports.createPaymentController = async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod } = req.body;

    const result = await createPayment(bookingId, amount, paymentMethod);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
