"use strict";

module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert(
      "user",
      [
        {
          id: "49963626-8014-408e-88c9-46aa2d1a4f10",
          email: "admin@gmail.com",
          name: "admin",
          cpf: "04420518081",
          celular: "11951328475",
          permissionToNotification: false,
          idAuthy: 123,
          checked: true,
          password:
            "$2y$10$wcc1HnVTx1Y7ueWJPNc75e9aEAlqyUbXp6cZgjYnTwqcqAI79sa/a",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    ),

  down: queryInterface => queryInterface.bulkDelete("user", null, {})
};
