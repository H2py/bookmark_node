const express = require("express");
const app = express();
const PORT = 3000;
const userRoutes = require("./users");

app.use(express.json());

app.use('/api', userRoutes)

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log("I'm Listening Right now");
});
