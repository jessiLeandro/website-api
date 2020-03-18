const routes = require("express").Router({ mergeParams: true });
const UserController = require("../../Controllers/User");

routes.post("", UserController.create);
routes.post("/check", UserController.check);
// routes.put("/troll", UserController.troll);
// routes.get("", UserController.getAll);
// routes.get("/verifyTroll", UserController.verifyTroll);

module.exports = routes;
