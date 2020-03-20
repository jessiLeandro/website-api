const R = require("ramda");
const Cpf = require("@fnando/cpf/commonjs");
const { promisify } = require("util");

const authy = require("authy")(process.env.APIKEY);
// const authy = require("authy")("APIKEY");

const database = require("../../database");
const { FieldValidationError } = require("../../helpers/errors");

const User = database.model("user");

module.exports = class UserDomain {
  async create(body, options = {}) {
    const { transaction = null } = options;
    const user = body;

    console.log(user);
    const bodyHasProp = prop => R.has(prop, user);

    let errors = false;

    const field = {
      email: false,
      password: false,
      name: false,
      cpf: false,
      celular: false,
      permissionToNotification: false
    };

    const message = {
      email: "",
      password: "",
      name: "",
      cpf: "",
      celular: "",
      permissionToNotification: ""
    };

    if (!bodyHasProp("password") || !user.password) {
      errors = true;
      field.senha = true;
      message.senha = "password cannot null";
    }

    if (!bodyHasProp("name") || !user.name) {
      errors = true;
      field.name = true;
      message.name = "name cannot null";
    }

    if (!bodyHasProp("cpf") || !user.cpf) {
      errors = true;
      field.cpf = true;
      message.cpf = "cpf cannot null";
    } else if (!Cpf.isValid(user.cpf.replace(/\D/gi, ""))) {
      errors = true;
      field.cpf = true;
      message.cpf = "O cpf ou o cpf informado não é válido.";
    } else if (
      await User.findOne({
        where: { cpf: user.cpf.replace(/\D/gi, "") },
        transaction
      })
    ) {
      errors = true;
      field.cpf = true;
      message.cpf = "O cpf ou cpf infomardo já existem em nosso sistema.";
    }

    if (!bodyHasProp("celular") || !user.celular) {
      errors = true;
      field.celular = true;
      message.celular = "celular cannot null";
    } else if (
      await User.findOne({
        where: { celular: user.celular.replace(/\D/gi, "") },
        transaction
      })
    ) {
      errors = true;
      field.celular = true;
      message.celular = "celular already registered";
    }
    if (
      !bodyHasProp("permissionToNotification") ||
      typeof body.permissionToNotification !== "boolean"
    ) {
      errors = true;
      field.permissionToNotification = true;
      message.permissionToNotification = "permissionToNotification cannot null";
    }

    if (!bodyHasProp("email") || !user.email) {
      errors = true;
      field.email = true;
      message.email = "email cannot null";
    } else {
      if (!/^[\w_\-\.]+@[\w_\-\.]{2,}\.[\w]{2,}(\.[\w])?/.test(user.email)) {
        errors = true;
        field.email = true;
        message.email = "email invalid";
      } else if (
        await User.findOne({
          where: { email: user.email },
          transaction
        })
      ) {
        errors = true;
        field.email = true;
        message.email = "email already registered";
      }
    }

    // authy.verify(241201474, "3179527", function(err, res) {
    //   console.log(res);
    // });

    // authy.delete_user(241231744, function(err, res) {
    //   console.log(res);
    // });

    if (errors) {
      throw new FieldValidationError([{ field, message }]);
    }

    const userCreated = await User.create(user, { transaction });
    // const userCreated = await User.build(user, { transaction });

    // await authy.register_user(
    //   user.email,
    //   user.celular,
    //   "55",
    //   promisify(function(err, res) {
    //     console.log("res", res);
    //     if (res && res.success) {
    //       userCreated.update({ idAuthy: res.user.id });
    //       authy.request_sms(res.user.id, function(err, res) {
    //         console.log(res.message);
    //       });
    //     } else {
    //       errors = true;
    //       field.idAuthy = true;
    //       message.idAuthy = "idAuthy cannot null";
    //       throw new FieldValidationError([{ field, message }]);
    //     }
    //   })
    // );
    // throw new FieldValidationError([{ field, message }]);

    return userCreated;

    // await new Promise(resolve => {
    //   setTimeout(() => {
    //     console.log("et");
    //     return { teste: "teste" };
    //   }, 1000);
    // });
    // throw new FieldValidationError([{ field, message }]);
    // return userCreated;

    // await sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // const msg = {
    //   to: user.email,
    //   from: "jessi_leandro@hotmail.com",
    //   subject: "Sending with Twilio SendGrid is Fun",
    //   text: "and easy to do anywhere, even with Node.js",
    //   html: `
    //   <strong>Sua chave de acesso: ${user.cpf}</strong>
    //   <a href='http://localhost:3000'>aplication</a>
    //   `
    // };
    // await sgMail
    //   .send(msg)
    //   .then(function(resp) {
    //     console.log("resposta :");
    //   })
    //   .catch(function(err) {
    //     console.log("error: ", err);
    //   });
  }

  async delete(bodyData, options = {}) {
    const { transaction = null } = options;

    const { id } = bodyData;

    const user = await User.findByPk(id, { transaction });

    if (!user.checked) {
      await user.destroy({ force: true, transaction });

      authy.delete_user(user.idAuthy, function(err, res) {
        console.log(res);
      });

      return "deleted";
    } else {
      return "auth";
    }
  }

  async check(bodyData, options = {}) {
    const { transaction = null } = options;

    console.log(bodyData);

    const BodyNotHasProps = props => R.not(R.has(props, bodyData));

    let error = false;

    const field = {
      key: false,
      id: false
    };

    const message = {
      key: "",
      id: ""
    };

    if (BodyNotHasProps("key") || !bodyData.key) {
      error = true;
      field.key = true;
      message.key = "key cannot null";
    }

    if (BodyNotHasProps("id") || !bodyData.id) {
      error = true;
      field.id = true;
      message.id = "id cannot null";
    }

    if (error) {
      throw new FieldValidationError([{ field, message }]);
    }

    const { key, id } = bodyData;

    const user = await User.findByPk(id, {
      transaction
    });

    // authy.request_sms(user.idAuthy, function(err, res) {
    //   console.log(res.message);
    // });

    // throw new FieldValidationError([{ field, message }]);

    console.log(user.idAuthy, key);
    if (!user) {
      error = true;
      field.id = true;
      message.id = "id invalid";
    } else {
      authy.verify(user.idAuthy, key, function(err, res) {
        console.log(res);
        console.log(err);
        if (res !== undefined && err === null) {
          const userUpdate = {
            ...JSON.parse(JSON.stringify(user)),
            checked: true
          };
          user.update(userUpdate, {});
        } else {
          error = true;
          field.key = true;
          message.key = "key invalid";
        }
      });
    }

    await new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve();
      }, 3000);
    });

    if (error) {
      throw new FieldValidationError([{ field, message }]);
    }

    const response = await User.findByPk(id, {
      transaction
    });

    return response;
  }

  async update(body, options = {}) {
    const { transaction = null } = options;

    const user = await User.findByPk(body.id, { transaction });

    if (!user) {
      throw new FieldValidationError([
        { field: { id: true }, message: { id: "user not found" } }
      ]);
    }

    const userUpdate = R.omit(["id"], body);

    const bodyNotHasProp = prop => R.not(R.has(prop, userUpdate));

    let errors = false;

    const field = {
      name: false
    };
    const message = {
      name: ""
    };

    if (bodyNotHasProp("name") || !userUpdate.name) {
      errors = true;
      field.name = true;
      message.name = "name cannot null";
    }

    if (bodyNotHasProp("cpf") || !userUpdate.cpf) {
      errors = true;
      field.cpf = true;
      message.cpf = "cpf cannot null";
    } else if (!Cpf.isValid(userUpdate.cpf.replace(/\D/gi, ""))) {
      errors = true;
      field.cpf = true;
      message.cpf = "cpf invalid";
    } else {
      const userAlreadyRegistered = await User.findOne({
        attributes: ["id", "cpf"],
        where: { cpf: user.cpf.replace(/\D/gi, "") },
        transaction
      });

      if (userAlreadyRegistered && userAlreadyRegistered.cpf !== user.cpf) {
        errors = true;
        field.cpf = true;
        message.cpf = "already registered";
      }
    }
    if (errors) {
      throw new FieldValidationError([{ field, message }]);
    }

    return await user.update(userUpdate, { transaction });
  }

  async updatePassword(body, options = {}) {
    const { transaction = null } = options;

    console.log(body);

    const user = await User.findByPk(body.id, { transaction });

    if (!user) {
      throw new FieldValidationError([
        { field: { id: true }, message: { id: "user not found" } }
      ]);
    }

    const bodyNotHasProp = prop => R.not(R.has(prop, body));

    let errors = false;

    const field = {
      password: false,
      newPassword: false
    };
    const message = {
      password: "",
      newPassword: ""
    };

    if (bodyNotHasProp("password") || !body.password) {
      errors = true;
      field.password = true;
      message.password = "password cannot null";
    } else if (!(await user.checkPassword(body.password))) {
      errors = true;
      field.password = true;
      message.password = "invalid password";
    }

    if (bodyNotHasProp("newPassword") || !body.newPassword) {
      errors = true;
      field.newPassword = true;
      message.newPassword = "newPassword cannot null";
    }

    if (errors) {
      throw new FieldValidationError([{ field, message }]);
    }

    return await user.update({ password: body.newPassword }, { transaction });
  }
};
