const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const passport = require("passport");
const session = require("express-session");

const app = express();

//Loads Route
const ideas = require("./routes/ideas");
const users = require("./routes/users");

//Passport Config
require("./config/passport")(passport);

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

//Static folder
app.use(express.static(path.join(__dirname, "public")));
//Express session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
    // cookie: { secure: true }
  })
);

//Pasport middleware
app.use(passport.initialize());
app.use(passport.session());

//Flash Message Middleware
app.use(flash());

//Global Variable
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

//Middleware works
app.use(function(req, res, next) {
  // console.log(Date.now());
  // req.name = "Ram";
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

//Use Route
app.use("/ideas", ideas);
app.use("/users", users);

const port = 5000;
app.listen(port, () => {
  console.log(`Server Started on port:${port}`);
});
