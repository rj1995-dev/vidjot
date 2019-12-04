const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

//Map global promises
mongoose.Promise = global.Promise;
//Connect to mongoose
mongoose
  .connect("mongodb://localhost/vidjot-dev", {
    // useMongoClient: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Connected...."))
  .catch(err => console.log(err));

//Load Idea Model
require("./models/Idea");
const Idea = mongoose.model("Ideas");
//Handlebrs Middlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

//Body Parser Middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

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
//Add Idea Form
app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});

//Process form Data
app.post("/ideas", (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please add details" });
  }

  if (errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    res.send("passed");
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server Started on port:${port}`);
});
