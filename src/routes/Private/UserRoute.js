const routes = require("express").Router({ mergeParams: true });
const UserController = require("../../Controllers/User");

routes.post("", UserController.create);
routes.post("/check", UserController.check);
routes.put("", UserController.update);
routes.put("/password", UserController.updatePassword);
// routes.get("", UserController.getAll);
// routes.get("/verifyTroll", UserController.verifyTroll);

module.exports = routes;
