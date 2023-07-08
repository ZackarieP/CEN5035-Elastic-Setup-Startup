// "use strict";
// const { env } = require("dotenv").config({ path: ".env-local" });
// const fs = require("fs");
// const http = require("http");

// const { Client } = require("@elastic/elasticsearch");
// const client = new Client({
//   node: process.env.elastic_server,
//   auth: {
//     username: process.env.elastic_userid,
//     password: process.env.elastic_password,
//   },
//   tls: {
//     ca: fs.readFileSync("./http_ca.crt"),
//     rejectUnauthorized: true,
//   },
// });

// async function run() {
//   // Let's start by indexing some data
//   // await client.index({
//   //   index: "game-of-thrones",
//   //   document: {
//   //     character: "Ned Stark",
//   //     quote: "Winter is coming.",
//   //   },
//   // });

//   // here we are forcing an index refresh, otherwise we will not
//   // get any result in the consequent search
//   // await client.indices.refresh({ index: "game-of-thrones" });

//   // Let's search!
//   // const result = await client.search({
//   //   index: "game-of-thrones",
//   //   query: {
//   //     match: { quote: "books" },
//   //   },
//   // });

//   const result = await client.search({
//     index: "shakespeare",
//     query: {
//       match_phrase: {
//         text_entry: "to be or not to be",
//       },
//     },
//   });

//   console.log(result.hits.hits);
// }

// run().catch(console.log);

"use strict";
const { env } = require("dotenv").config({ path: ".env-local" });
const fs = require("fs");
const http = require("http");

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

async function run() {
  const server = http.createServer(async (req, res) => {
    try {
      const result = await client.search({
        index: "shakespeare",
        query: {
          match_phrase: {
            text_entry: "to be or not to be",
          },
        },
      });

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(result.hits.hits));
    } catch (error) {
      console.error("Error:", error.meta.body.error);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });

  const port = 3000;
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

run().catch(console.log);
