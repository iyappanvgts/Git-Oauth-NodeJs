const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const clientId = "c9fbc5df04a588cff8c0";
const clientSecret = "51be5d31435559ad542ebfab3cea54018fe29bb2";
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.get("/accessToken", async function (req, res) {
  const code = req.query.code;
  await fetch(
    `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}&scope=repo%20read:org%20admin:org%20user:email`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      res.json(data);
    });
});

app.get("/getUser", async function (req, res) {
  const header = req.get("Authorization");
  await fetch(`https://api.github.com/user`, {
    method: "GET",
    headers: {
      Authorization: header,
    },
  })
    .then((response) => {
      console.log("response", response);
      return response.json();
    })
    .then((data) => {
      console.log("jhbjh", data);
      res.json(data);
    });
});
app.get("/getOrg", async function (req, res) {
  const header = req.get("Authorization");
  const response = await fetch(`https://api.github.com/user/orgs`, {
    method: "GET",
    headers: {
      Authorization: header,
    },
  });
  const data = await response.json();
  if (data.documentation_url) {
    console.error(data);
    res.status(500).send("Error fetching repositories from GitHub API.");
    return;
  }
  console.log(data);
  res.status(200).send(data);
});

app.get("/getRepo", async function (req, res) {
  const header = req.get("Authorization");
  const orgName = req.query.orgName;
  const response = await fetch(`https://api.github.com/orgs/${orgName}/repos`, {
    method: "GET",
    headers: {
      Authorization: header,
    },
  });
  const data = await response.json();
  if (data.documentation_url) {
    console.error(data);
    res.status(500).send("Error fetching repositories from GitHub API.");
    return;
  }
  console.log(data);
  res.status(200).send(data);
});
1;

app.get("/branches", async function (req, res) {
  const full_name = req.query.full_name;
  console.log(`https://api.github.com/repos/${full_name}/branches`);
  const header = req.get("Authorization");
  await fetch(`https://api.github.com/repos/${full_name}/branches`, {
    method: "GET",
    headers: {
      Authorization: header,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      res.json(data);
    });
});
app.get("/commits", async function (req, res) {
  const full_name = req.query.full_name;
  const sha = req.query.sha;
  console.log(`https://api.github.com/repos/${full_name}/commits?sha=${sha}`);
  const header = req.get("Authorization");
  await fetch(`https://api.github.com/repos/${full_name}/commits?sha=${sha}`, {
    method: "GET",
    headers: {
      Authorization: header,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      res.json(data);
    });
});

app.listen(4000, function () {
  console.log("Server running in 4000");
});
