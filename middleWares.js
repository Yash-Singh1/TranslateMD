request = require("request");

module.exports = {
  ignoreFavicon: (req, res, next) => {
    if (req.originalUrl && req.originalUrl.split("/").pop() === "favicon.ico") {
      return res.sendStatus(204);
    }
    return next();
  },

  methodIgnore: (req, res, next) => {
    if (req.method != "POST") {
      return res.sendStatus(400);
    }
    return next();
  },
  badBody: (req, res, next) => {
    req.nextThing = false;
    request(
      "https://api.cognitive.microsofttranslator.com/languages?api-version=3.0",
      function (error, response, body) {
        if (error) {
          console.error(error);
        } else {
          req.support = JSON.parse(body).translation;
          Object.keys(JSON.parse(body).translation).forEach((key) => {
            if (key == req.body.lang) {
              req.lang = JSON.parse(body).translation[key].name;
              req.nextThing = true;
              return next();
            } else {
              if (req.nextThing == false) {
                req.nextThing = false;
              }
            }
          });
          if (req.nextThing == false) {
            return next();
          }
        }
      }
    );
  },
  nextThingie: (req, res, next) => {
    if (req.nextThing == false) {
      return res.sendStatus(400);
    }
    return next();
  },
  modeValid: (req, res, next) => {
    if (req.body.mode === undefined) {
      req.body.mode = "markdown";
      return next();
    } else if (req.body.mode == "plain") {
      req.body.mode = "markdown";
      return next();
    } else if (req.body.mode != "markdown" || req.body.mode != "gfm") {
      req.body.mode = "markdown";
      return next();
    }
  },
  needKey: (req, res, next) => {
    if (req.body.lang == undefined) {
      return res.sendStatus(400);
    } else {
      return next();
    }
  },
};
