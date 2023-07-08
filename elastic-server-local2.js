"use strict";
const { env } = require("dotenv").config({ path: ".env-local" });
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

const { Client } = require("@elastic/elasticsearch");
const client = new Client({
  node: process.env.elastic_server,
  auth: {
    username: process.env.elastic_userid,
    password: process.env.elastic_password,
  },
  tls: {
    ca: fs.readFileSync("./http_ca.crt"),
    rejectUnauthorized: true,
  },
});

const app = express();
const port = 3000;
const addr = "https://localhost:3000";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/search", async (req, res) => {
  try {
    const searchTerm = req.body.query;

    const response = await client.search({
      index: "shakespeare",
      body: {
        query: {
          match: {
            text_entry: searchTerm,
          },
        },
      },
    });

    res.setHeader("Content-Type", "application/json");

    const searchResults = response.hits.hits;
    res.json(searchResults); // Send search results as JSON response
    console.log(searchResults);
    //     console.log(res.status(200).json(searchResults));
    //     res.send(searchResults);
  } catch (error) {
    console.error("Error:", error.meta?.body?.error || error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Server address: ${addr}`);
});

function displayResults(results) {
  // Display the results on the page
  var searchResultsDiv = document.getElementById("searchResults");
  var html =
    "<table class='table'><thead><tr><th>Play Name</th><th>Speech Number</th><th>Speaker</th><th>Line ID</th></tr></thead><tbody>";
  results.forEach(function (result) {
    html +=
      "<tr><td>" +
      result._source.play_name +
      "</td><td>" +
      result._source.speech_number +
      "</td><td>" +
      result._source.speaker +
      "</td><td>" +
      result._source.line_id +
      "</td></tr>";
  });
  html += "</tbody></table>";
  searchResultsDiv.innerHTML = html;
}
