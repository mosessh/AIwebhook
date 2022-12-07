const token = process.env.TOKEN;

//const request = require("request"),
const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios").default;
const app = express().use(body_parser.json());  
app.listen(process.env.PORT, () =>{
     console.log("webhook is listening");
});

app.get("/webhook", (req, res) => {
 
    const verify_token = process.env.MYTOKEN;
  
    // Parse params from the webhook verification request
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
  
    // Check if a token and mode were 
    if (mode && token) {
      // Check the mode and token sent are correct
      if (mode === "subscribe" && token === verify_token) {
        // Respond with 200 OK and challenge token from the request
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  });

app.post("/webhook", (req, res) => {
  
  let body_param = req.body;
 
  console.log(JSON.stringify(body_param, null, 2));
 
  if (body_param.object) {
    if (body_param.entry &&
    body_param.entry[0].changes &&
    body_param.entry[0].changes[0].value.messages &&
    body_param.entry[0].changes[0].value.messages[0]
    ) {
 
      let phone_number_id =
      body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;  
      let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body; 
      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:"https://graph.facebook.com/v15.0/"+phone_number_id +"/messages?access_token="+token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: { body: "Hello... from meta we build"},
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }
    res.sendStatus(200);
  } else { 
    res.sendStatus(404);
  }
});
