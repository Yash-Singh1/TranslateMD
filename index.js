const express = require("express");
const request = require("request");
const middleWares = require("./middleWares");
var app = express();
app.use(middleWares.methodIgnore);
app.use(middleWares.ignoreFavicon);
app.use(express.json());
app.use(middleWares.badBody);
app.use(middleWares.modeValid);
app.use(middleWares.nextThingie);
app.use(middleWares.needKey);
const uri =
  process.env.url ||
  "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0";

function translateHTML(html, lang, res, req, APIkey) {
  request(
    {
      method: "POST",
      uri: uri,
      qs: {
        "api-version": "3.0",
        to: lang,
        textType: "html",
      },
      headers: {
        "Ocp-Apim-Subscription-Key": APIkey,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: [
        {
          text: html,
        },
      ],
      json: true,
    },
    function (err, body) {
      if (err) {
        console.error(err);
      } else {
        if (body.body.error !== undefined) {
          res.sendStatus(400);
        }
        Object.keys(req.support).forEach((key) => {
          if (key == body.body[0].detectedLanguage.language) {
            req.detect = req.support[key].name;
          }
        });
        let html =
          '<meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://raw.githubusercontent.com/sindresorhus/github-markdown-css/gh-pages/github-markdown.css"><style>.markdown-body{box-sizing:border-box;min-width:200px;max-width:980px;margin:0 auto;padding:45px}@media(max-width:767px){.markdown-body{padding:15px}}</style><article class="markdown-body">' +
          body.body[0].translations[0].text +
          "<p>Text translated from " +
          req.detect +
          " to " +
          req.lang +
          " with a score of " +
          (parseInt(body.body[0].detectedLanguage.score) * 100).toString() +
          "%.</p></article>";
        res.header({
          "Content-Type": "text/html; charset=utf-8",
          "Content-Length": html.length,
        });
        res.send(html);
      }
    }
  );
}

function gfmtoHTML(chunk, lang, res, context, mode, req, APIkey) {
  request.post(
    {
      url: "https://api.github.com/markdown/raw",
      body: chunk,
      headers: {
        "User-Agent": "node",
        "Content-Type": "text/plain; charset=utf-8",
      },
      qs: {
        mode: mode,
        context: context,
      },
    },
    function optionalCallback(err, httpResponse, body) {
      if (err) {
        return console.error(err);
      } else {
        translateHTML(httpResponse.body, lang, res, req, APIkey);
      }
    }
  );
}

app.post("/url", (req, res) => {
  let url = req.body.url;
  let lang = req.body.lang;
  let mode = req.body.mode;
  let key = req.body.key;
  let context = undefined;
  if (req.body.context !== undefined && mode != "markdown") {
    context = req.body.context;
  }
  request.get(url, function (err, body) {
    if (err) {
      return res.sendStatus(400);
    } else {
      gfmtoHTML(body.body, lang, res, context, mode, req, key);
    }
  });
});

app.post("/raw", (req, res) => {
  let chunk = req.body.text;
  let lang = req.body.lang;
  let mode = req.body.mode;
  let key = req.body.key;
  let context = undefined;
  if (req.body.context !== undefined && mode != "markdown") {
    context = req.body.context;
  }
  gfmtoHTML(chunk, lang, res, context, mode, req, key);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
