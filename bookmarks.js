const express = require("express");
const router = express.Router();
const db = require("./db");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "your-secret-key";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

router.post("/bookmarks", authenticateToken, async (req, res) => {
  const { title, url } = req.body;
  const email = req.user.email;

  try {
    const users = await db("users").where({ email });
    if (users.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const userId = users[0].id;

    await db("bookmarks").insert({
      title,
      url,
      user_id: userId,
    });

    res.status(201).json({ message: "Bookmark added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/bookmarks", authenticateToken, async (req, res) => {
  const email = req.user.email;

  try {
    const users = await db("users").where({ email });
    if (users.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const userId = users[0].id;

    const bookmarks = await db("bookmarks")
      .where({ user_id: userId })
      .orderBy("created_at", "desc");

    res.json({ bookmarks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/bookmarks/:id", authenticateToken, async (req, res) => {
  const email = req.user.email;
  const users = await db("users").where({ email });
  const userId = users[0].id;
  const bookmarkId = req.params.id;

  try {
    const specificBook = await db("bookmarks")
      .where({ id: bookmarkId, user_id: userId })
      .first();

    if (!specificBook) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.json({ specificBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/bookmarks/:id", authenticateToken, async (req, res) => {
  const email = req.user.email;
  const users = await db("users").where({ email });
  const userId = users[0].id;
  const bookmarkId = req.params.id;
  const { title, url } = req.body;

  try {
    const specificBook = await db("bookmarks")
      .where({ id: bookmarkId, user_id: userId })
      .first();

    if (!specificBook) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    await db("bookmarks")
      .where({ id: bookmarkId, user_id: userId })
      .update({ title, url });

    res.status(200).json({ message: "Bookmark revised Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/bookmarks/:id", authenticateToken, async (req, res) => {
  const email = req.user.email;
  const users = await db("users").where({ email });
  const userId = users[0].id;
  const bookmarkId = req.params.id;
  const { title, url } = req.body;

  try {
    const specificBook = await db("bookmarks")
      .where({ id: bookmarkId, user_id: userId })
      .first();

    if (!specificBook) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    await db("bookmarks").where({ id: bookmarkId, user_id: userId }).del();

    res.status(200).json({ message: "Bookmark revised Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
