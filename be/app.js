// Copyright (c) 2021 Learnosity, Apache 2.0 License
//
// Basic example of loading a standalone assessment in a web page using Items API
// with `rendering_type: "assess"`.
"use strict";

// Include server side Learnosity SDK, and set up variables related to user access.
const Learnosity = require("learnosity-sdk-nodejs"); // Include Learnosity SDK constructor
const config = require("./config"); // Load consumer key & secret from config.js
const express = require("express"); // Load 'Express.js", a web server
const app = express(); // Instantiate the web server
const cors = require("cors");
const lodash = require("lodash");
var bodyParser = require('body-parser')

app.set("view engine", "ejs"); // Set EJS as our templating language

app.use(cors());
app.use(bodyParser.json())


// - - - - - - Learnosity server-side configuration - - - - - - //

// Set the web server domain.

const domain = "localhost";

app.get("/items", function (req, res) {
  const learnositySdk = new Learnosity(); // Instantiate the SDK
  // Reports API configuration parameters.
  const request = learnositySdk.init(
    "author", // Select Author API
    // Consumer key and consumer secret are the public & private security keys required to access Learnosity APIs and data. These keys grant access to Learnosity's public demos account. Learnosity will provide keys for your own account.
    {
      consumer_key: config.consumerKey, // Load key from config.js
      domain: domain, // Set the domain (from line 20)
    },
    config.consumerSecret, // Load secret from config.js
    // simple api request object for item list view
    {
      mode: "item_edit",
      config: {
        item_edit: {
          item: {
            reference: {
              show: true,
              edit: false,
            },
            dynamic_content: true,
            shareed_passage: true,
            enable_audio_recording: true,
          },
        },
      },
      user: {
        id: "demos-site",
        firstname: "Demos",
        lastname: "User",
        email: "demos@learnosity.com",
      },
    }
  );

  return res.json(request);

  // res.render('item-list', { request }); // Render the page and request.
});

app.post("/signature", (req, res) => {
  const learnositySdk = new Learnosity(); // Instantiate the SDK

  const signature = learnositySdk.init(
    req.body.data.service,
    {
      consumer_key: config.consumerKey, // Load key from config.js
      domain: req.hostname, // Set the domain (from line 20)
    },
    config.consumerSecret,
    req.body.data.config
  );

  return res.json(signature);
});

app.listen(3000, function () {
  // Run the web application. Set the port here (3000).
  console.log("Example app listening on port 3000!");
});

// Note: for further reading, the client-side web page configuration can be found in the EJS template: 'docs/quickstart/views/item-list.ejs'. //
