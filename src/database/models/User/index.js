const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const moment = require("moment");

const getHash = plainPassoword => bcrypt.hash(plainPassoword, 10);

const shouldMakeAHash = user => user.changed("password");

const makeHashPasswordHook = async user => {
  if (shouldMakeAHash(user)) {
    user.password = await getHash(user.password);
  }
};

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define("user", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    cpf: {
      type: Sequelize.STRING,
      allowNull: false
    },
    celular: {
      type: Sequelize.STRING,
      allowNull: false
    },
    permissionToNotification: {
      type: Sequelize.BOOLEAN,
      defaltValue: false
    },
    idAuthy: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    checked: {
      type: Sequelize.BOOLEAN,
      defautValue: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  user.prototype.checkPassword = function(password) {
    return bcrypt.compare(password, this.password);
  };

  user.prototype.generateToken = function() {
    return jwt.sign(
      {
        id: this.id,
        troll: this.troll,
        iat: Math.floor(Date.now() / 1000) - 30,
        exp: this.troll
          ? Math.floor(moment().add(15, "minute")) / 1000
          : Math.floor(moment().endOf("day")) / 1000
      },
      process.env.APP_SECRET
    );
  };

  user.beforeCreate(makeHashPasswordHook);
  user.beforeUpdate(makeHashPasswordHook);

  return user;
};
