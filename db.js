const knex = require("knex");

const db = knex({
  client: "sqlite3",
  connection: {
    filename: "./mydb.sqlite",
  },
  useNullAsDefault: true,
});

module.exports = db;
