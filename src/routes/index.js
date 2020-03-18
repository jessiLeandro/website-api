const routes = require("express").Router();
const cors = require("cors");
const bodyparse = require("body-parser");
// const authMiddleware = require('');
const SessionController = require("../Controllers/Session");
const authMiddleware = require("../middleware/auth");
const UserRoute = require("./Private/UserRoute");

routes.use(
  cors({
    // origin: process.env.ORIGIN,
    origin: "*",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

routes.use(bodyparse.json());

routes.post("/sessions", SessionController.store);
routes.use("/user", UserRoute);

routes.use(authMiddleware);

module.exports = routes;
