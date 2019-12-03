const express = require("express");
var exphbs = require("express-handlebars");

const app = express();

//Handlebrs Middlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

//Middleware works
app.use(function(req, res, next) {
  // console.log(Date.now());
  req.name = "Ram";
  next();
});

//Index Route
app.get("/", (req, res) => {
  // console.log(req.name);
  const title = "Welcome";
  res.render("index", {
    title: title
  });
});

//About Route
app.get("/about", (req, res) => {
  const title = "About";
  res.render("about", {
    title: title
  });
});
const port = 5000;
app.listen(port, () => {
  console.log(`Server Started on port:${port}`);
});
