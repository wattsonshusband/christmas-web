const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

const daysData = JSON.parse(fs.readFileSync("./data/days.json"));
const girlfriendMessages = JSON.parse(fs.readFileSync("./data/messages.json"));

app.get("/", (req, res) => {
 res.render("home");
});

app.get("/calendar", (req, res) => {
 const today = new Date();
 const currentDay = today.getMonth() === 11 ? today.getDate() : 0; // December only

 res.render("calendar", { currentDay });
});

app.get("/day/:id", (req, res) => {
 const id = req.params.id;
 const today = new Date();
 const currentDay = today.getMonth() === 11 ? today.getDate() : 0;

 if (id > currentDay) {
   return res.send("<h1>This day is locked! Come back later.</h1>");
 }

 const content = {
  title: `Day ${id}`,
  message: girlfriendMessages[id]
 };
 
 res.render("day", { content });
});

app.get("/api/messages/:id", (req, res) => {
  const id = req.params.id;
  const message = girlfriendMessages[id];

  if (!message) {
    return res.status(404).json({ error: "Message not found." });
  }

  res.json({ id: id, message: message });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
