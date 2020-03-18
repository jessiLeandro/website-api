require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
});

module.exports = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  password: process.env.DB_PASSWORD,
  username: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  dialect: "postgres",
  // operatorsAliases: false,
  logging: false,
  define: {
    timestamps: true
    // underscored: true,
    // underscoredAll: true
  }
};
