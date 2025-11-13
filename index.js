const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const config = require("config");
const logger = require("./middleware/logger");
const authentication = require("./authentication");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const courses = require("./routes/courses");
const home = require("./routes/home");
const app = express();
app.use(express.json());
app.use("/api/courses", courses);
app.use("/", home);
app.use(logger);
app.use(authentication);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(helmet());

app.set("view engine", "pug");

console.log(`Env value: ${process.env.NODE_ENV}`);
console.log(`Env val from app.get: ${app.get("env")}`);

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  // console.log("Morgan enabled...");
  startupDebugger("Morgan enabled");
}

dbDebugger("Connecting to the database...");

//Configuration
console.log("Application name: " + config.get("name"));
console.log("Mail server: " + config.get("mail.host"));
console.log("Mail password: " + config.get("mail.password"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
