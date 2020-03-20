const UserDomain = require("../../Domain/User");
const database = require("../../database");
const userDomain = new UserDomain();

class UserController {
  async create(req, res, next) {
    const transaction = await database.transaction();
    try {
      const user = await userDomain.create(req.body, { transaction });

      setTimeout(async function() {
        await userDomain.delete({ id: user.id }, { trasaction });
      }, 3600000);

      await transaction.commit();
      res.json(user);
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }

  async check(req, res, next) {
    const trasaction = await database.transaction();
    try {
      const user = await userDomain.check(req.body, { trasaction });

      await trasaction.commit();
      res.json(user);
    } catch (error) {
      await trasaction.rollback();
      next(error);
    }
  }

  async update(req, res, next) {
    const transaction = await database.transaction();
    try {
      const user = await userDomain.update(req.body, { transaction });

      await transaction.commit();
      res.json(user);
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }
  async updatePassword(req, res, next) {
    const transaction = await database.transaction();
    try {
      const user = await userDomain.updatePassword(req.body, { transaction });

      await transaction.commit();
      res.json(user);
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }
}

module.exports = new UserController();
