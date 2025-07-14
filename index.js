const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

const app = express();

const conn = require("./db/conn");

// Models
const Thinking = require("./models/Thinking");
const User = require("./models/User");

// import routes
const thinkingRoutes = require("./routes/thinkingRoutes");
const authRoutes = require("./routes/authRoutes");

// import controller
const ThinkingController = require("./controllers/ThinkingController");

// Template Engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// receive response from body
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

app.use(express.json());

app.use(
  session({
    name: "session",
    secret: "my_secret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 360000,
      expires: new Date(Date.now() + 360000),
      httpOnly: true,
    },
  })
);

// flash messages
app.use(flash());

// set session to response
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session;
  }

  next();
});

app.use("/thinking", thinkingRoutes);
app.use("/", authRoutes);

app.get("/", ThinkingController.showThinking);

conn
  // .sync({ force: true })
  .sync()
  .then(() => app.listen(3000))
  .catch((error) => console.log(error));
