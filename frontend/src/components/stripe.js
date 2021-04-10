const stripe = require('stripe')(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)

async function postCharge(req, res) {
  try {
    const { amount, source, receipt_email } = req.body

    const charge = await stripe.charges.create({
      amount,
      currency: 'usd',
      source,
      receipt_email
    })

    if (!charge) throw new Error('charge unsuccessful')

    res.status(200).json({
      message: 'charge posted successfully',
      charge
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

module.exports = postCharge