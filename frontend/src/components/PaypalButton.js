import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {paypal} from "paypal-rest-sdk";


function PaypalButton(props) {
  const [sdkReady, setSdkReady] = useState(false);

  const addPaypalSdk = async () => {
    const result = await axios.get("/api/config/paypal");
    const clientID = result.data;
    const script = document.createElement('script');
    script.type = 'text/javascript'; 
	  
    script.src ='https://www.paypal.com/sdk/js?client-id=ATW2CIi18HyaVRwJDgRj0aKFiph_RkZ6m2VDGE2XC7jiqCbYg8DjrWaGU7n30vhMvcOLRmr661XBLAAK&currency=EUR'
  
	script.async = true;
    script.onload = () => {
      setSdkReady(true);
    }
    document.body.appendChild(script);
  }

//paypal.configure({
  //  mode: "sandbox", //sandbox or live
  //  client_id:
  //      "ARDbx3MuUA109TlhAhTpM_TXWomh-m2laUm4WEOHkk9ykhT0A8ioQS2mKKqPnMl3FVUsWoabU99Ammqv",
 //   client_secret:
  //      "EMvacWRkjVji5P95u-dygCXfcKdd2HvQ3zK2mgLcYlHzCZD5EhR-DuQem4kMYhixORBN_UsPzimXPIOC"
//});

  const createOrder = (data, actions) => actions.order.create({
    purchase_units: [
      {
        amount: {
          currency_code: 'EUR',
          value: props.amount
        }
      }
    ]
  });

  const onApprove = (data, actions) => actions.order
    .capture()
    .then(details => props.onSuccess(data, details))
    .catch(err => console.log(err));

  useEffect(() => {
    if (!window.paypal) {
      addPaypalSdk();
    }
    return () => {
      //
    };
  }, []);

  if (!sdkReady) {
    return <div>Loading...</div>
  }

  const Button = window.paypal.Buttons.driver('react', { React, ReactDOM });

  return <Button {...props} createOrder={(data, actions) => createOrder(data, actions)}
    onApprove={(data, actions) => onApprove(data, actions)} />
}

export default PaypalButton;



