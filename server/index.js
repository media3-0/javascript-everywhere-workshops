const request = require("request");
const level = require("level");
const express = require("express");

const db = level("cache.db");
const app = express();

const API_ENDPOINT = "https://api-v3.mojepanstwo.pl/dane/poslowie.json";

function getPage(url, callback) {
  console.log("downloading: " + url);

  db.get(url, function(error, cachedBody) {
    if (error) {
      request(url, function(error, response) {
        if (error) {
          callback(error, null);
          return;
        }

        db.put(url, response.body, function(error) {
          if (error) {
            callback(error, null);
            return;
          }

          const data = JSON.parse(response.body);
          callback(null, data);
        });
      });
    } else {
      const data = JSON.parse(cachedBody);
      callback(null, data);
    }
  });
}

function getAllPages(startUrl, allData, callback) {
  getPage(startUrl, function(error, data) {
    if (error) {
      callback(error, null);
      return;
    }

    allData = allData.concat(data.Dataobject);

    if (data.Links.next) {
      getAllPages(data.Links.next, allData, callback);
    } else {
      callback(null, allData);
    }
  });
}

app.get("/api/poslowie", function(req, res) {
  getAllPages(API_ENDPOINT, [], function(error, data) {
    if (error) {
      res.status(500);
      return;
    }

    res.send(data);
  });
});

app.listen(4000);
console.log("HTTP server runs on http://localhost:4000");
