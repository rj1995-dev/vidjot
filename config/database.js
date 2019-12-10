if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI: "mongodb://ram:ram1995@ds353378.mlab.com:53378/videos-ideas-app"
  };
} else {
  module.exports = {
    mongoURI: "mongodb://localhost/vidjot-dev"
  };
}
