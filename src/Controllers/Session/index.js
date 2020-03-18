const database = require("../../database");

const User = database.model("user");

class SessionController {
  async store(req, res) {
    const transaction = await database.transaction();
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      transaction
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ message: "incorrect password" });
    }

    return res.json({ user, token: user.generateToken() });
  }
}

module.exports = new SessionController();
