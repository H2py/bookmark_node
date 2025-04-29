const express = require("express");
const app = express();
const PORT = 3000;
const userRoutes = require("./users");
const db = require("./db");
const bookmarkRoutes = require("./bookmarks");

app.use(express.json());

db.schema.hasTable("users").then((exists) => {
  if (!exists) {
    return db.schema
      .createTable("users", (table) => {
        table.increments("id").primary();
        table.string("email").unique().notNullable();
        table.string("password").notNullable();
        table.timestamp("created_at").defaultTo(db.fn.now());
      })
      .then(() => console.log("Now DB is created"));
  }
});

db.schema.hasTable("bookmarks").then((exists) => {
  if (!exists) {
    return db.schema
      .createTable("bookmarks", (table) => {
        table.increments("id").primary();
        table.string("title").notNullable();
        table.string("url").notNullable();
        table
          .integer("user_id")
          .unsigned()
          .references("id")
          .inTable("users")
          .onDelete("CASCADE");
        table.timestamp("created_at").defaultTo(db.fn.now());
      })
      .then(() => console.log("Bookmarks table created"));
  }
});

app.use("/api", userRoutes);
app.use("/api", bookmarkRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log("I'm Listening Right now");
});
