const express = require("express");
const Router = express.Router();
const ytSearch = require("youtube-sr").default;

Router.get("/search", async (req, res) => {
  let query = req.query.search_string || "kangal neeyeh";
  let data = await ytSearch.search(query, { limit: 10 });
  return res.status(200).send({ status: true, data });
});

module.exports = Router;
