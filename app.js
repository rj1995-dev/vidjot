const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");

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
//method override middleware
app.use(methodOverride("_method"));
//Express session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
    // cookie: { secure: true }
  })
);

//Flash Middleware
app.use(flash());

//Global Variable
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

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

//Idea index Page
app.get("/ideas", (req, res) => {
  Idea.find({})
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

//Add Idea Form
app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});

//Edit Idea Form
app.get("/ideas/edit/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    res.render("ideas/edit", {
      idea: idea
    });
  });
});

//Delete Form Data
app.delete("/ideas/:id", (req, res) => {
  Idea.deleteOne({
    _id: req.params.id
  }).then(() => {
    req.flash("success_msg", "Video idea removed");
    res.redirect("/ideas");
  });
});

//Process form Data
app.post("/ideas", (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please add some details" });
  }

  if (errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    };
    new Idea(newUser).save().then(idea => {
      req.flash("success_msg", "Video idea added");
      res.redirect("/ideas");
    });
  }
});

//Process Edit Form Data
app.put("/ideas/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    //new value
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save().then(idea => {
      req.flash("success_msg", "Video idea updated");
      res.redirect("/ideas");
    });
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server Started on port:${port}`);
});
