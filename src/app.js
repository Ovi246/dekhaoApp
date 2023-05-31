let express = require("express");
const firebase = require("./firebase.js");
const bodyParser = require("body-parser");

let app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server);
let stream = require("./ws/stream");
let path = require("path");
let favicon = require("serve-favicon");

app.use(favicon(path.join(__dirname, "favicon.ico")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use((req, res, next) => {
  var user = firebase.auth().currentUser;
  res.locals.currentUser = user;
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    console.log(email, username, password);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        //console.log(user);
        res.json({ success: true });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
        res.json({ errorCode, errorMessage });
      });
  } catch (e) {
    console.log(e);
    res.json({
      errorCode: "unknown_error",
      errorMessage: "An unknown error occurred.",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        res.json({ success: true, user: user });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        res.json({ errorCode, errorMessage });
      });
  } catch (e) {
    console.log(e);
    res.json({
      errorCode: "unknown_error",
      errorMessage: "An unknown error occurred.",
    });
  }
});

app.get("/logout", function (req, res) {
  firebase
    .auth()
    .signOut()
    .then(() => {
      res.redirect("/login");
    })
    .catch((error) => {
      // An error happened.
    });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/register.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

io.of("/stream").on("connection", stream);

server.listen(3000);
