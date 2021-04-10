router.post('/checkout', async (req, res) => {
  
  try {

    const order_items = [];
    for(let i=0; i<req.body.items.length; i++) {
      order_items.push({
        name: req.body.items[i].name,
        amount: req.body.items[i].amount*100,
        currency: 'inr',
        quantity: req.body.items[i].quantity,
        images: [req.body.items[i].image]
      });
    }

    //Create Order in database
    const order = await database.createOrder({items: req.body.items, platform: req.body.platform, createdAt: new Date().toISOString(), paymentStatus: 'pending'});

    let success_url = '';
    let cancel_url = '';
    if(req.body.platform === 'web') {
      success_url = `${BASE_URL}/.netlify/functions/api/payment/success?platform=web`;
      cancel_url = `${BASE_URL}/.netlify/functions/api/payment/cancel?platform=web`;
    }
    else {
      success_url = `${BASE_URL}/.netlify/functions/api/payment/success`;
      cancel_url = `${BASE_URL}/.netlify/functions/api/payment/cancel`;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: order_items,
      success_url,
      cancel_url,
      client_reference_id: order._id.toString(),
      customer_email: 'email@example.com',
    });
    
    res.send({orderId: order._id.toString(), sessionId: session.id});
  }
  catch(err) {
    res.status(500).send('Internal Server Error');
  }
})